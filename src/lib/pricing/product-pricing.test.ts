import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateMarginBps, calculateProfitCents } from "./margin";
import { calculateScheduledDiscountPrice, getDiscountScheduleStatus } from "./scheduled-discounts";

describe("product pricing helpers", () => {
  it("calculates profit and margin", () => {
    assert.equal(calculateProfitCents(10_000, 4_000), 6_000);
    assert.equal(calculateMarginBps(10_000, 4_000), 6_000);
  });

  it("calculates scheduled percentage discounts", () => {
    const now = new Date("2026-05-10T12:00:00Z");
    const discount = {
      active: true,
      startsAt: new Date("2026-05-10T00:00:00Z"),
      endsAt: new Date("2026-05-11T00:00:00Z"),
      type: "percentage" as const,
      percentageBps: 2500,
    };

    assert.equal(getDiscountScheduleStatus(discount, now), "active");
    assert.equal(calculateScheduledDiscountPrice(10_000, discount, now), 7_500);
  });
});
