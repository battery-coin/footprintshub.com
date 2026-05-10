import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveTenantFromHost } from "./resolveTenant";

describe("resolveTenantFromHost", () => {
  it("maps localhost to the flagship shop", () => {
    assert.equal(resolveTenantFromHost("localhost:3000")?.shopSlug, "footprintshub");
  });

  it("maps FootprintsHub domains to the flagship shop", () => {
    assert.equal(resolveTenantFromHost("www.footprintshub.com")?.kind, "flagship");
  });

  it("maps shop.herostudio.org to the platform shop", () => {
    assert.equal(resolveTenantFromHost("shop.herostudio.org")?.kind, "platform");
  });

  it("maps creator subdomains to creator shops", () => {
    const tenant = resolveTenantFromHost("ava.herostudio.org");
    assert.equal(tenant?.kind, "creator");
    assert.equal(tenant?.creatorSubdomain, "ava");
  });
});
