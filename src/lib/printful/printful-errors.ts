export class PrintfulConfigError extends Error {
  constructor(message = "Printful is not configured.") {
    super(message);
    this.name = "PrintfulConfigError";
  }
}

export class PrintfulValidationError extends Error {
  constructor(
    message: string,
    public readonly details: string[] = [],
  ) {
    super(message);
    this.name = "PrintfulValidationError";
  }
}

export class PrintfulApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "PrintfulApiError";
  }
}

export class PrintfulRateLimitError extends PrintfulApiError {
  constructor(status: number, payload?: unknown) {
    super("Printful rate limit reached.", status, payload);
    this.name = "PrintfulRateLimitError";
  }
}

export class PrintfulNetworkError extends Error {
  constructor(message = "Printful network request failed.") {
    super(message);
    this.name = "PrintfulNetworkError";
  }
}

export class PrintfulDuplicateOrderError extends PrintfulApiError {
  constructor(status: number, payload?: unknown) {
    super("Printful rejected the order because the external order ID already exists.", status, payload);
    this.name = "PrintfulDuplicateOrderError";
  }
}

export function getSafePrintfulError(input: unknown) {
  if (input instanceof PrintfulValidationError) {
    return { name: input.name, message: input.message, details: input.details };
  }

  if (input instanceof PrintfulApiError) {
    return { name: input.name, message: input.message, status: input.status, payload: input.payload };
  }

  if (input instanceof Error) {
    return { name: input.name, message: input.message };
  }

  return { name: "UnknownPrintfulError", message: "Unknown Printful error." };
}
