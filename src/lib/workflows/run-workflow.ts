import type { WorkflowContext, WorkflowDefinition, WorkflowResult } from "./types";

export async function runWorkflow<TInput, TOutput>(
  definition: WorkflowDefinition<TInput, TOutput>,
  input: TInput,
  context: WorkflowContext = {},
): Promise<WorkflowResult<TOutput>> {
  const completedSteps: string[] = [];
  const compensatedSteps: string[] = [];
  const executed: Array<{
    stepId: string;
    input: unknown;
    compensate?: (input: unknown, context: WorkflowContext, error: unknown) => void | Promise<void>;
  }> = [];
  const workflowContext: WorkflowContext = {
    ...context,
    events: context.events ?? [],
  };

  let current: unknown = input;

  try {
    for (const step of definition.steps) {
      workflowContext.log?.({
        level: "info",
        workflowId: definition.id,
        stepId: step.id,
        message: `Starting ${step.name}`,
      });

      executed.push({
        stepId: step.id,
        input: current,
        compensate: step.compensate as
          | ((input: unknown, context: WorkflowContext, error: unknown) => void | Promise<void>)
          | undefined,
      });
      current = await (step.execute as (input: unknown, context: WorkflowContext) => unknown | Promise<unknown>)(
        current,
        workflowContext,
      );
      completedSteps.push(step.id);
    }

    const result = definition.mapResult
      ? definition.mapResult(current, input, workflowContext)
      : (current as TOutput);

    return {
      status: "completed",
      result,
      completedSteps,
      compensatedSteps,
      events: workflowContext.events ?? [],
    };
  } catch (error) {
    for (const { stepId, compensate, input: stepInput } of executed.reverse()) {
      if (!compensate) {
        continue;
      }

      await compensate(stepInput, workflowContext, error);
      compensatedSteps.push(stepId);
    }

    workflowContext.log?.({
      level: "error",
      workflowId: definition.id,
      message: "Workflow failed",
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });

    return {
      status: "failed",
      error,
      completedSteps,
      compensatedSteps,
      events: workflowContext.events ?? [],
    };
  }
}
