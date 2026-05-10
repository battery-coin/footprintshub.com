import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasPermission, requirePermission } from "./permissions";

describe("admin permissions", () => {
  it("allows explicit role permission", () => {
    assert.equal(
      hasPermission({ userId: "user_1", rolePermissions: ["orders.read"] }, "orders.read"),
      true,
    );
  });

  it("blocks missing permission", () => {
    const result = requirePermission({ userId: "user_1", rolePermissions: [] }, "payouts.approve");
    assert.equal(result.ok, false);
  });

  it("allows platform owner", () => {
    assert.equal(
      hasPermission({ userId: "user_1", rolePermissions: [], isPlatformOwner: true }, "platform.manage"),
      true,
    );
  });
});
