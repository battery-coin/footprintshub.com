import type { WalletBalances, WalletLedgerDraft } from "./types";

const debitTypes = new Set(["reject_debit", "payout_debit", "reversal_debit", "manual_debit", "coupon_debit"]);

export function calculateWalletBalances(ledgers: WalletLedgerDraft[]): WalletBalances {
  const balances: WalletBalances = {
    pending: 0,
    approved: 0,
    available: 0,
    paid: 0,
    rejected: 0,
    lifetimeEarned: 0,
    lifetimePaid: 0,
  };

  for (const ledger of ledgers) {
    const signedAmount = debitTypes.has(ledger.type) ? -Math.abs(ledger.amountCents) : ledger.amountCents;
    balances[ledger.balanceType] += signedAmount;

    if (ledger.type === "pending_credit" || ledger.type === "approve_credit" || ledger.type === "manual_credit") {
      balances.lifetimeEarned += Math.max(0, ledger.amountCents);
    }

    if (ledger.type === "payout_debit") {
      balances.lifetimePaid += Math.abs(ledger.amountCents);
    }
  }

  return balances;
}
