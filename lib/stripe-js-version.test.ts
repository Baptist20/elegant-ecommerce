import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The checkout page loads Stripe.js through the @stripe/stripe-js loader.
// This pins the client loader to the security/bug-fix release 10.4.0 while
// guarding the call-site contract that must keep working: loadStripe() takes
// the publishable key and the loader is imported from @stripe/stripe-js.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relativePath: string): any {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function parseVersion(value: string): [number, number, number] {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(value);
  assert.ok(match, `expected a semver version in "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function atLeast(
  actual: [number, number, number],
  minimum: [number, number, number],
): boolean {
  for (let index = 0; index < 3; index += 1) {
    if (actual[index] !== minimum[index]) {
      return actual[index] > minimum[index];
    }
  }
  return true;
}

test("checkout loads @stripe/stripe-js 10.4.0 or newer", () => {
  const pkg = readJson("package.json");
  const lock = readJson("package-lock.json");

  const declared = pkg.dependencies?.["@stripe/stripe-js"];
  assert.equal(typeof declared, "string", "package.json must declare @stripe/stripe-js");
  assert.ok(
    atLeast(parseVersion(declared), [10, 4, 0]),
    `package.json must allow @stripe/stripe-js >= 10.4.0, found "${declared}"`,
  );

  const locked = lock.packages?.["node_modules/@stripe/stripe-js"];
  assert.ok(locked, "package-lock.json must lock @stripe/stripe-js");
  assert.ok(
    atLeast(parseVersion(locked.version), [10, 4, 0]),
    `package-lock.json must resolve @stripe/stripe-js >= 10.4.0, found "${locked.version}"`,
  );
  assert.match(
    locked.resolved ?? "",
    /@stripe\/stripe-js\/-\/stripe-js-10\.4\.0\.tgz$/,
    "the lockfile must resolve the 10.4.0 tarball",
  );

  // The server SDK is a separate package and must not be downgraded to the
  // client loader's version as a side effect of this update.
  const server = pkg.dependencies?.stripe;
  assert.equal(typeof server, "string", "package.json must declare stripe");
  assert.ok(
    atLeast(parseVersion(server), [22, 0, 0]),
    `the server stripe SDK must stay >= 22.0.0, found "${server}"`,
  );

  // Guard the existing call-site contract: loadStripe is called with the
  // publishable key and no unsupported positional arguments.
  const checkout = readFileSync(
    path.join(root, "app/checkout/page.tsx"),
    "utf8",
  );
  assert.match(
    checkout,
    /import\s*\{\s*loadStripe\s*\}\s*from\s*["']@stripe\/stripe-js["']/,
    "checkout must import loadStripe from @stripe/stripe-js",
  );
  assert.match(
    checkout,
    /loadStripe\(\s*process\.env\.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\s*\|\|\s*""\s*,?\s*\)/,
    "checkout must call loadStripe with the publishable key",
  );
});
