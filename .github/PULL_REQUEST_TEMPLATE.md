## Summary

Describe the change in plain English.

## ClickUp task

CU-____

Task URL:

## Risk level

Low / Medium / High / Production Critical

## Scope / bounded context

Check all that apply:

- [ ] UI / UX
- [ ] Rider app
- [ ] Driver app
- [ ] Admin app
- [ ] Auth / identity
- [ ] Supabase / database
- [ ] Payments / wallet / ledger
- [ ] Dispatch / trips
- [ ] Safety / compliance
- [ ] CI / tooling
- [ ] Docs / architecture
- [ ] Infrastructure
- [ ] AI

## What changed

-

## What did not change

- No product behavior changes unless explicitly stated.
- No production-readiness claim unless a separate production-readiness review proves otherwise.

## Tests run

- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm test
- [ ] npm run build
- [ ] npm run audit:high
- [ ] npm audit
- [ ] npm run db:test, when Supabase migrations/RLS/RPC/database behavior changes are touched

## Audit status

Report the exact `npm run audit:high` and plain `npm audit` results.

Audit output must not be suppressed.

## Architecture compliance

- [ ] Checked against the Hatid architecture baseline
- [ ] No violation of frozen production boundaries
- [ ] ADR linked if architecture changes

ADR link:

## Guardrails

Do not claim production readiness for mocked behavior.

Confirm:

- [ ] No secrets committed
- [ ] No generated files committed
- [ ] No client-authoritative critical state added
- [ ] No fake payment/wallet/payout behavior added
- [ ] No unauthorized dispatch/admin/safety backend added
- [ ] No production-readiness claim for mocked behavior

## AI disclosure

AI assisted: Yes / No

If yes:

- Tool:
- Scope generated:
- Validation performed:

## Deployment impact

Describe deployment impact, environment variables, migrations, and preview/deployment risk.

Do not claim branch protection is enabled without proof from repository settings.

## Rollback / roll-forward plan

Describe the exact rollback or roll-forward path.

## Remaining risks

-

## Unresolved questions

-

## Production readiness

Still prototype only unless a separate production-readiness review proves otherwise.
