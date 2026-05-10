import test from "node:test";
import assert from "node:assert/strict";
import { affiliateStructureTemplates, getStructureEngineNotice } from "./structure-templates";

test("includes binary, matrix, and unilevel templates", () => {
  assert.deepEqual(
    affiliateStructureTemplates.map((template) => template.structureType).sort(),
    ["binary", "matrix", "unilevel"],
  );
});

test("marks only unilevel as a functional payout engine", () => {
  const byType = Object.fromEntries(affiliateStructureTemplates.map((template) => [template.structureType, template]));

  assert.equal(byType.unilevel.engineStatus, "functional");
  assert.equal(byType.binary.engineStatus, "scaffolded");
  assert.equal(byType.matrix.engineStatus, "scaffolded");
  assert.match(getStructureEngineNotice("binary"), /scaffolded/i);
  assert.match(getStructureEngineNotice("matrix"), /scaffolded/i);
});
