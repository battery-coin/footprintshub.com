export class RefundError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export class RefundConfigurationError extends RefundError {
  constructor(message: string) {
    super(message, 503);
  }
}
