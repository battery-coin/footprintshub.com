import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSafeAdTargetUrl } from "./creative-validation";

test("validateSafeAdTargetUrl allows http and https", () => {
  assert.equal(validateSafeAdTargetUrl("https://example.com/campaign"), true);
  assert.equal(validateSafeAdTargetUrl("http://example.com/campaign"), true);
});

test("validateSafeAdTargetUrl rejects unsafe schemes", () => {
  assert.equal(validateSafeAdTargetUrl("javascript:alert(1)"), false);
  assert.equal(validateSafeAdTargetUrl("data:text/html,hello"), false);
  assert.equal(validateSafeAdTargetUrl("not-a-url"), false);
});
