import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashWebhookPayload } from "./webhook-events";

describe("hashWebhookPayload", () => {
  it("creates stable hashes for webhook payload idempotency", () => {
    assert.equal(hashWebhookPayload("{\"id\":\"evt_1\"}"), hashWebhookPayload("{\"id\":\"evt_1\"}"));
    assert.notEqual(hashWebhookPayload("{\"id\":\"evt_1\"}"), hashWebhookPayload("{\"id\":\"evt_2\"}"));
  });
});
