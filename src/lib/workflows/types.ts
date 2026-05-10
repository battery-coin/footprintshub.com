export type WorkflowStatus = "completed" | "failed";

export type WorkflowLogLevel = "info" | "warn" | "error";

export type WorkflowLogEntry = {
  level: WorkflowLogLevel;
  workflowId: string;
  stepId?: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export type WorkflowEvent = {
  type: string;
  aggregateType: string;
  aggregateId: string;
  payload?: Record<string, unknown>;
};

export type WorkflowContext = {
  shopId?: string;
  actorUserId?: string;
  idempotencyKey?: string;
  events?: WorkflowEvent[];
  log?: (entry: WorkflowLogEntry) => void;
};

export type WorkflowStep<TInput = unknown, TOutput = unknown> = {
  id: string;
  name: string;
  idempotencyKey?: string;
  auditLog?: boolean;
  execute: (input: TInput, context: WorkflowContext) => TOutput | Promise<TOutput>;
  compensate?: (input: TInput, context: WorkflowContext, error: unknown) => void | Promise<void>;
};

export type WorkflowDefinition<TInput = unknown, TOutput = unknown> = {
  id: string;
  name: string;
  steps: WorkflowStep<TInput, unknown>[];
  mapResult?: (lastStepResult: unknown, input: TInput, context: WorkflowContext) => TOutput;
};

export type WorkflowResult<TOutput = unknown> = {
  status: WorkflowStatus;
  result?: TOutput;
  error?: unknown;
  completedSteps: string[];
  compensatedSteps: string[];
  events: WorkflowEvent[];
};
