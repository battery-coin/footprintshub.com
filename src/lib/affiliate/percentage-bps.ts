import { bpsToPercent, formatBpsAsPercent, percentToBps, validatePercentage } from "@/lib/money/percentage-bps";

export function bpsToPercentString(bps?: number | null) {
  return formatBpsAsPercent(bps);
}

export function percentStringToBps(input: string | number) {
  return percentToBps(input);
}

export function validatePercentInput(input: string | number) {
  return validatePercentage(input);
}

export { bpsToPercent, formatBpsAsPercent, percentToBps, validatePercentage };
