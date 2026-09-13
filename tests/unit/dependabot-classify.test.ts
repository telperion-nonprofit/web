import test from "node:test";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("../../scripts/classify-dependabot-update.sh", import.meta.url),
);

function classify(commitMessage: string): boolean {
  const out = execFileSync("bash", [script], {
    input: commitMessage,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  return out.trim() === "true";
}

// Real Dependabot output shapes taken from this repository's own history.

test("merges a grouped update whose trailers are all patch or minor", () => {
  assert.strictEqual(
    classify(`build(deps-dev): bump the development-minor-patch group with 4 updates

Updates \`@playwright/test\` from 1.61.1 to 1.63.0
Updates \`eslint\` from 10.6.0 to 10.10.0

---
updated-dependencies:
- dependency-name: "@playwright/test"
  dependency-version: 1.63.0
  dependency-type: direct:development
  update-type: version-update:semver-minor
- dependency-name: eslint
  dependency-version: 10.10.0
  dependency-type: direct:development
  update-type: version-update:semver-minor
...`),
    true,
  );
});

test("holds a major, even alongside compatible updates in the same group", () => {
  assert.strictEqual(
    classify(`build(deps-dev): bump eslint-plugin-astro from 2.1.1 to 3.1.0

---
updated-dependencies:
- dependency-name: prettier
  dependency-version: 3.9.6
  dependency-type: direct:development
  update-type: version-update:semver-patch
- dependency-name: eslint-plugin-astro
  dependency-version: 3.1.0
  dependency-type: direct:development
  update-type: version-update:semver-major
...`),
    false,
  );
});

// Indirect dependencies carry no update-type. These used to be declined
// outright, which left every transitive security bump waiting for a human.

test("merges an indirect patch bump that has no update-type trailer", () => {
  assert.strictEqual(
    classify(`build(deps): bump tar from 7.5.19 to 7.5.22

Bumps [tar](https://github.com/isaacs/node-tar) from 7.5.19 to 7.5.22.

---
updated-dependencies:
- dependency-name: tar
  dependency-version: 7.5.22
  dependency-type: indirect
...`),
    true,
  );
});

test("merges an indirect minor bump spanning several patch levels", () => {
  assert.strictEqual(
    classify(`build(deps): bump baseline-browser-mapping from 2.10.41 to 2.11.23

Bumps baseline-browser-mapping from 2.10.41 to 2.11.23.

---
updated-dependencies:
- dependency-name: baseline-browser-mapping
  dependency-version: 2.11.23
  dependency-type: indirect
...`),
    true,
  );
});

test("merges a multi-version indirect bump when every pair is compatible", () => {
  assert.strictEqual(
    classify(`build(deps): bump svgo

Updates \`svgo\` from 4.0.1 to 4.1.0
Updates \`svgo\` from 3.3.3 to 3.3.5

---
updated-dependencies:
- dependency-name: svgo
  dependency-version: 4.1.0
  dependency-type: indirect
- dependency-name: svgo
  dependency-version: 3.3.5
  dependency-type: indirect
...`),
    true,
  );
});

test("holds an indirect major bump", () => {
  assert.strictEqual(
    classify(`build(deps): bump left-pad from 1.2.3 to 2.0.0

Bumps left-pad from 1.2.3 to 2.0.0.

---
updated-dependencies:
- dependency-name: left-pad
  dependency-version: 2.0.0
  dependency-type: indirect
...`),
    false,
  );
});

test("holds a 0.x minor bump, where breaking changes live", () => {
  assert.strictEqual(
    classify(`build(deps): bump sharp from 0.35.3 to 0.36.0

Bumps sharp from 0.35.3 to 0.36.0.

---
updated-dependencies:
- dependency-name: sharp
  dependency-version: 0.36.0
  dependency-type: indirect
...`),
    false,
  );
});

test("merges a 0.x patch bump", () => {
  assert.strictEqual(
    classify(`build(deps): bump sharp from 0.35.3 to 0.35.4

Bumps sharp from 0.35.3 to 0.35.4.

---
updated-dependencies:
- dependency-name: sharp
  dependency-version: 0.35.4
  dependency-type: indirect
...`),
    true,
  );
});

test("holds a mixed indirect bump when any pair crosses a major", () => {
  assert.strictEqual(
    classify(`build(deps): bump a bundle

Updates \`safe-one\` from 1.0.0 to 1.1.0
Updates \`risky-one\` from 3.4.5 to 4.0.0

---
updated-dependencies:
- dependency-name: safe-one
  dependency-version: 1.1.0
  dependency-type: indirect
- dependency-name: risky-one
  dependency-version: 4.0.0
  dependency-type: indirect
...`),
    false,
  );
});

test("holds an update whose versions cannot be read at all", () => {
  assert.strictEqual(
    classify(`build(deps): bump something

---
updated-dependencies:
- dependency-name: something
  dependency-version: 9.9.9
  dependency-type: indirect
...`),
    false,
  );
});

test("holds anything that is not a recognisable Dependabot commit", () => {
  assert.strictEqual(classify("chore: unrelated commit\n"), false);
});
