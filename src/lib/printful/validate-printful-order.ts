import { PrintfulValidationError } from "./printful-errors";
import type { PrintfulOrderPayload } from "./printful-types";

export function validatePrintfulOrderPayload(payload: PrintfulOrderPayload) {
  const errors: string[] = [];

  if (!payload.external_id.trim()) errors.push("Printful external order ID is required.");
  if (!payload.recipient.name.trim()) errors.push("Recipient name is required.");
  if (!payload.recipient.address1.trim()) errors.push("Recipient address line 1 is required.");
  if (!payload.recipient.city.trim()) errors.push("Recipient city is required.");
  if (!payload.recipient.country_code.trim()) errors.push("Recipient country code is required.");
  if (!payload.recipient.zip.trim()) errors.push("Recipient postal code is required.");
  if (!payload.items.length) errors.push("At least one Printful item is required.");

  for (const [index, item] of payload.items.entries()) {
    if (item.quantity < 1) errors.push(`Item ${index + 1} quantity must be positive.`);
    if (!item.variant_id && !item.sync_variant_id) errors.push(`Item ${index + 1} needs a Printful variant ID or sync variant ID.`);
  }

  if (errors.length) {
    throw new PrintfulValidationError("Printful order payload is invalid.", errors);
  }

  return payload;
}
