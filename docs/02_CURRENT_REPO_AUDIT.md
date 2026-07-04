# Current Repo Audit

## Verdict

Hatid is a prototype, not an MVP, beta, or production-ready transport platform.

The repo has a Next.js UI shell and client-facing prototype infrastructure, but it does not have authoritative production systems for transport, dispatch, payment, wallet, payout, safety, admin, or compliance operations. UI completeness must not be treated as operational readiness.

## Current repo signals

- `package.json` is now named `hatid`.
- `README.md` has been rewritten and honestly says Hatid is prototype-only.
- `next.config.ts` no longer suppresses TypeScript or ESLint build failures.
- The test script was previously Unix-only because it used `rm -rf`; this PR changes it to `rimraf`.
- The build script was previously environment-shell dependent; this PR changes it to `cross-env NODE_ENV=production`.
- CI previously did not provide the requested Phase 0 shape; this PR makes lint, typecheck, tests, and build hard blockers.
- `npm run audit:high` currently exits 0 at the high threshold, but `npm audit` still reports 28 moderate vulnerabilities. Dependency hardening must be handled in a separate PR.

## What is real

- Next.js app shell.
- Prototype rider and driver UI surfaces.
- Firebase/Firestore client-facing prototype infrastructure.
- Supabase project files exist in the repository, but they are not an authoritative runtime on `main`.
- Trip state-machine source and tests exist as implementation foundation.
- CI quality gates are being made explicit by this PR.

## What is not real yet

- No authoritative backend exists.
- No PostgreSQL/PostGIS runtime exists.
- No Cloud Run service exists.
- No real dispatch exists.
- No production driver availability or location ingest service exists.
- No live payment provider integration exists.
- No wallet, stored-value, cash-in, cash-out, payout, or reconciliation service exists.
- No production admin backend exists.
- No production safety/SOS backend exists.
- No real maps provider wiring, routing, or fare engine exists.
- No production audit-log authority exists.

## Firebase and Firestore boundary

Firestore remains client-facing prototype infrastructure. It must not be treated as the production source of truth for trips, dispatch, driver availability, payment state, wallet balances, payouts, admin overrides, onboarding approvals, safety incidents, or compliance records.

Firebase may support prototype flows while the repo remains in this phase. It does not make Hatid production-ready.

## Dependency audit status

`npm audit --audit-level=high` must be run and reported honestly. In this PR it exits 0 and reports 28 moderate vulnerabilities, with no high or critical failure at the configured threshold.

The reported moderate vulnerabilities include `js-yaml`, `postcss` via `next`, and `uuid` through Genkit/Google dependency chains. They are not fixed in this PR because dependency hardening belongs in a dedicated follow-up.

Dependency hardening belongs in a dedicated follow-up PR.

## Dangerous if left ambiguous

- Any UI copy implying real driver matching.
- Any UI copy implying real card charging, wallet movement, payout, or settlement.
- Any client-side trip completion, payment completion, wallet balance, or driver availability action being treated as production behavior.
- Any audit failure hidden by CI or final reporting.
- Any docs claiming MVP, beta, production readiness, live dispatch, live payments, wallet, payouts, admin operations, or safety readiness.

## Production-readiness score

| Area | Score | Reason |
|---|---:|---|
| UI shell | 65/100 | Useful for prototype exploration, not operational proof. |
| Auth/profile foundation | 40/100 | Client-facing foundation exists, but production authority and role controls are incomplete. |
| Trip authority | 10/100 | State-machine foundation exists, but no authoritative backend runtime exists. |
| Dispatch | 0/100 | No real dispatch engine. |
| Payments/wallet | 0/100 | No live provider, ledger, wallet, payout, webhook, or reconciliation service. |
| Driver operations | 10/100 | Prototype UI and planning only; no complete operational backend. |
| Safety | 5/100 | No production incident backend. |
| Admin/ops | 5/100 | No production admin backend. |
| Compliance/privacy | 15/100 | Planning exists; production implementation is incomplete. |
| Production infrastructure | 20/100 | Frontend/build foundation exists; no authoritative backend runtime is operating. |

## Phase 0 cleanup targets

1. Keep package identity honest.
2. Keep README and audit docs prototype-only.
3. Keep lint, typecheck, tests, and build as hard quality gates.
4. Keep generated test output ignored.
5. Keep dependency audit visible until a dedicated hardening PR resolves it.
6. Do not add product behavior under repo-cleanup work.

## Rule

No future code should make the current prototype flows look production-real until backend authority, ledger, dispatch, maps, safety, admin, and compliance systems exist.
