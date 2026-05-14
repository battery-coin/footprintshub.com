import test from "node:test";
import assert from "node:assert/strict";
import { affiliateStructureTemplates, getStructureEngineNotice } from "./structure-templates";

test("includes binary, matrix, and unilevel templates", () => {
  assert.deepEqual(
    affiliateStructureTemplates.map((template) => template.structureType).sort(),
    ["binary", "matrix", "unilevel"],
  );
});

test("marks binary and matrix as configurable owner-managed structures", () => {
  const byType = Object.fromEntries(affiliateStructureTemplates.map((template) => [template.structureType, template]));

  assert.equal(byType.unilevel.engineStatus, "functional");
  assert.equal(byType.binary.engineStatus, "configurable");
  assert.equal(byType.matrix.engineStatus, "configurable");
  assert.match(getStructureEngineNotice("binary"), /configuration is active/i);
  assert.match(getStructureEngineNotice("matrix"), /configuration is active/i);
});
