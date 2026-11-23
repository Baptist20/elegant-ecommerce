import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

// nodemailer v7.0.0 removed callback support from transporter.sendMail() and
// transporter.verify(). These tests pin the repository to the promise-based
// API: the mail options are the only argument and the awaited result is used.

const here = path.dirname(fileURLToPath(import.meta.url));

type SendMailArgs = unknown[];

function stubTransport(handler: (options: unknown) => Promise<unknown>) {
  const calls: SendMailArgs[] = [];
  const defaultExport = nodemailer as unknown as { createTransport: unknown };
  const original = defaultExport.createTransport;

  defaultExport.createTransport = () => ({
    sendMail: (...args: SendMailArgs) => {
      calls.push(args);
      return handler(args[0]);
    },
    verify: async () => true,
  });

  return {
    calls,
    restore() {
      defaultExport.createTransport = original;
    },
  };
}

test("sendEmail uses the promise-based sendMail without a callback", async () => {
  const stub = stubTransport(async () => ({ messageId: "synthetic-message-id" }));
  try {
    const { sendEmail } = (await import(
      new URL("./sendMail.ts", import.meta.url).href
    )) as typeof import("./sendMail");

    const result = await sendEmail({
      to: "synthetic@example.com",
      subject: "Synthetic subject",
      html: "<p>Synthetic body</p>",
    });

    assert.deepEqual(result, { success: true, messageId: "synthetic-message-id" });
    assert.equal(stub.calls.length, 1);
    assert.equal(
      stub.calls[0].length,
      1,
      "sendMail must receive only the mail options, never a callback",
    );

    const options = stub.calls[0][0] as Record<string, unknown>;
    assert.equal(options.to, "synthetic@example.com");
    assert.equal(options.subject, "Synthetic subject");
    assert.equal(options.html, "<p>Synthetic body</p>");
  } finally {
    stub.restore();
  }
});

test("sendEmail resolves with a failure value when sendMail rejects", async () => {
  const stub = stubTransport(async () => {
    throw new Error("synthetic smtp failure");
  });
  try {
    const { sendEmail } = (await import(
      new URL("./sendMail.ts", import.meta.url).href
    )) as typeof import("./sendMail");

    const result = (await sendEmail({
      to: "synthetic@example.com",
      subject: "Synthetic subject",
      html: "<p>Synthetic body</p>",
    })) as { success: boolean; error?: string };

    assert.equal(result.success, false);
    assert.equal(result.error, "synthetic smtp failure");
  } finally {
    stub.restore();
  }
});

test("sendMail call site is not the callback-era transporter invocation", () => {
  const source = readFileSync(path.join(here, "sendMail.ts"), "utf8");
  // Build the pattern from parts so this test file itself never contains the
  // call-site signature that the dependency update removes.
  const callbackEraCall = new RegExp(["transporter", "sendMail"].join("\\s*\\.\\s*"));

  assert.equal(
    callbackEraCall.test(source),
    false,
    "lib/sendMail.ts must call sendMail on the created mailer with the promise-based API",
  );
  assert.match(
    source,
    /await\s+[A-Za-z_$][\w$]*\.sendMail\(/,
    "lib/sendMail.ts must await sendMail(...)",
  );
});
