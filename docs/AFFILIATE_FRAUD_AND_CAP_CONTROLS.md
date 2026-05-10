# Affiliate Fraud and Cap Controls

## Controls

- own-referral blocking
- self-purchase blocking by email/customer identity
- duplicate click spam detection
- suspicious conversion velocity flagging
- max commission per order
- max commission pool per order
- max monthly commission per affiliate
- blocked products
- blocked categories
- sale item exclusion if enabled
- refund reversal
- chargeback reversal
- manual review flags

## Privacy

Store IP hashes, not raw IP addresses. `AFFILIATE_IP_HASH_SECRET` should be configured in production so hashes cannot be reproduced from public data.

## Defaults

- Own-referral blocking: enabled.
- Max pool: 20% of qualified product subtotal.
- Compression: pay_zero.
- Cash payout: disabled until compliance review.
- Store credit: enabled.
