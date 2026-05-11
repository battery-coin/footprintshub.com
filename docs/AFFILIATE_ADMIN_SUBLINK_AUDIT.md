# Affiliate Admin Sublink Audit

Date: 2026-05-11

| Sublink | Route | Exists | Renders | Editable | Saves | API/model | Missing or scaffolded | Fixed in this pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Plans | `/admin/affiliates/plans` | yes | yes | yes | yes after migration | `AffiliatePlan` APIs | Needs production migration | verified |
| Structures | `/admin/affiliates/structures` | yes | yes | yes | yes after migration | template/use-template API | Binary/Matrix payout engines scaffolded | verified |
| Applications | `/admin/affiliates/applications` | yes | yes | partial | partial | affiliate status API | Full application workflow can deepen | verified |
| Referrals | `/admin/affiliates/referrals` | yes | yes | filter/report | schema/report scaffold | attribution models | More filters later | verified |
| Commissions | `/admin/affiliates/commissions` | yes | yes | filter/status scaffold | commission schema | commission engine | Binary/Matrix payouts scaffolded | verified |
| Payouts | `/admin/affiliates/payouts` | yes | yes | scaffold | payout schema | payout APIs | Payment rails pending | verified |
| Rules | `/admin/affiliates/rules` | yes | yes | partial | rule schema | commission rule model | Dedicated rule editor can deepen | verified |
| 7-level settings | `/admin/affiliates/levels` | yes | yes | yes | yes after migration | active-plan levels API | Requires migration for persistence | repaired |
| Ranks | `/admin/affiliates/ranks` | yes | yes | scaffold | rank schema/settings | rank model | Dedicated CRUD can deepen | verified |
| Performance tiers | `/admin/affiliates/performance-tiers` | yes | yes | scaffold | tier schema/settings | tier model | Dedicated CRUD can deepen | verified |
| Bonuses | `/admin/affiliates/bonuses` | yes | yes | scaffold | settings/rule scaffold | bonus model recommended | Future bonus engine | verified |
| Assets | `/admin/affiliates/assets` | yes | yes | scaffold | marketing asset schema | asset model | Upload/storage integration later | verified |
| Reports | `/admin/affiliates/reports` | yes | yes | filter/report | report scaffold | commission/click data | Charts can deepen | verified |
| Settings | `/admin/affiliates/settings` | yes | yes | partial | program/settings scaffold | `AffiliateProgram`, settings API | More program settings UI later | verified |

## Key Fix

`/admin/affiliates/levels` now loads the active affiliate plan and uses the same editable level editor as `/admin/affiliates/plans/[id]/levels`. It no longer displays static demo-only labels and percentages.
