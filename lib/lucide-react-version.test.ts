import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// lucide-react 1.81.0 adds the elevator, steering-wheel, globe-clock and
// bowl-chopsticks icons and updates the square-sigma, smartphone and rectangle
// icon shapes. The storefront imports its icons from this package, so pin the
// update while guarding the existing import contracts.

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

const updatedComponents = [
  "app/_components/AddToCartButton.tsx",
  "app/_components/ArticleCard.tsx",
  "app/_components/Articles.tsx",
  "app/_components/BlogHeader.tsx",
  "app/_components/BlogSummary.tsx",
  "app/_components/BlogToolbar.tsx",
  "app/_components/CartItem.tsx",
  "app/_components/CategoryBanner.tsx",
  "app/_components/ContactUsFeature.tsx",
  "app/_components/ContactUsHeader.tsx",
  "app/_components/NewArrivals.tsx",
  "app/_components/NewsLetter.tsx",
  "app/_components/ProductDetailClient.tsx",
  "app/_components/PromoBanner.tsx",
  "app/_components/ShopHeader.tsx",
  "app/_components/ShopToolbar.tsx",
  "app/_components/StatCards.tsx",
  "app/_components/UserSideNav.tsx",
  "app/_components/Values.tsx",
  "app/_components/WishlistButton.tsx",
];

test("storefront uses lucide-react 1.81.0 or newer", () => {
  const pkg = readJson("package.json");
  const lock = readJson("package-lock.json");

  const declared = pkg.dependencies?.["lucide-react"];
  assert.equal(typeof declared, "string", "package.json must declare lucide-react");
  assert.ok(
    atLeast(parseVersion(declared), [1, 81, 0]),
    `package.json must allow lucide-react >= 1.81.0, found "${declared}"`,
  );

  const locked = lock.packages?.["node_modules/lucide-react"];
  assert.ok(locked, "package-lock.json must lock lucide-react");
  assert.ok(
    atLeast(parseVersion(locked.version), [1, 81, 0]),
    `package-lock.json must resolve lucide-react >= 1.81.0, found "${locked.version}"`,
  );
  assert.match(
    locked.resolved ?? "",
    /lucide-react\/-\/lucide-react-1\.81\.0\.tgz$/,
    "the lockfile must resolve the 1.81.0 tarball",
  );

  // Guard the existing call-site contract: every affected component keeps
  // importing its icons as named exports from lucide-react.
  for (const component of updatedComponents) {
    const source = readFileSync(path.join(root, component), "utf8");
    assert.match(
      source,
      /import\s*\{\s*[^}]+\}\s*from\s*["']lucide-react["']/,
      `${component} must keep importing icons from lucide-react`,
    );
  }
});
