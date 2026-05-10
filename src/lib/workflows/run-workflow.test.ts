import test from "node:test";
import assert from "node:assert/strict";
import { runWorkflow } from "./run-workflow";
import type { WorkflowDefinition } from "./types";

test("runWorkflow runs steps and returns the final result", async () => {
  const workflow: WorkflowDefinition<number, number> = {
    id: "test.success",
    name: "Success",
    steps: [
      {
        id: "add-one",
        name: "Add one",
        execute: (input) => Number(input) + 1,
      },
      {
        id: "double",
        name: "Double",
        execute: (input) => Number(input) * 2,
      },
    ],
  };

  const result = await runWorkflow(workflow, 2);

  assert.equal(result.status, "completed");
  assert.equal(result.result, 6);
  assert.deepEqual(result.completedSteps, ["add-one", "double"]);
});

test("runWorkflow compensates executed steps after a failure", async () => {
  const compensated: string[] = [];
  const workflow: WorkflowDefinition<string, string> = {
    id: "test.failure",
    name: "Failure",
    steps: [
      {
        id: "reserve",
        name: "Reserve inventory",
        execute: (input) => input,
        compensate: () => {
          compensated.push("reserve");
        },
      },
      {
        id: "charge",
        name: "Charge card",
        execute: () => {
          throw new Error("card declined");
        },
      },
    ],
  };

  const result = await runWorkflow(workflow, "cart_1");

  assert.equal(result.status, "failed");
  assert.deepEqual(compensated, ["reserve"]);
  assert.deepEqual(result.compensatedSteps, ["reserve"]);
});
