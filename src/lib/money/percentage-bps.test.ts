import test from "node:test";
import assert from "node:assert/strict";
import { bpsToPercent, formatBpsAsPercent, percentToBps, validatePercentage } from "./percentage-bps";

test("converts display percentages to basis points", () => {
  assert.equal(percentToBps("10%"), 1000);
  assert.equal(percentToBps("2.5"), 250);
  assert.equal(percentToBps(0.25), 25);
});

test("converts basis points to display percentages", () => {
  assert.equal(bpsToPercent(250), 2.5);
  assert.equal(formatBpsAsPercent(1000), "10%");
  assert.equal(formatBpsAsPercent(25), "0.25%");
});

test("validates percentage bounds", () => {
  assert.equal(validatePercentage("12").ok, true);
  assert.equal(validatePercentage("-1").ok, false);
  assert.equal(validatePercentage("101").ok, false);
  assert.equal(validatePercentage("not-a-number").ok, false);
});
