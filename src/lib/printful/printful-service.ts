export type PrintfulSetupItem = {
  label: string;
  complete: boolean;
  detail: string;
};

export function getPrintfulSetupItems(): PrintfulSetupItem[] {
  return [
    {
      label: "PRINTFUL_API_KEY",
      complete: Boolean(process.env.PRINTFUL_API_KEY),
      detail: "Server-only token used for order submission and fulfillment status checks.",
    },
    {
      label: "PRINTFUL_STORE_ID",
      complete: Boolean(process.env.PRINTFUL_STORE_ID),
      detail: "Printful store identifier used to route paid orders to the correct store.",
    },
    {
      label: "PRINTFUL_API_BASE_URL",
      complete: Boolean(process.env.PRINTFUL_API_BASE_URL),
      detail: "Defaults to Printful API base URL when unset, but should be explicit in production.",
    },
    {
      label: "PRINTFUL_WEBHOOK_SECRET",
      complete: Boolean(process.env.PRINTFUL_WEBHOOK_SECRET),
      detail: "Shared secret for validating webhook calls through a private header or gateway rule.",
    },
  ];
}

export function isPrintfulConfigured() {
  return Boolean(process.env.PRINTFUL_API_KEY && process.env.PRINTFUL_STORE_ID);
}

export function getPrintfulApiBaseUrl() {
  return process.env.PRINTFUL_API_BASE_URL ?? "https://api.printful.com";
}

