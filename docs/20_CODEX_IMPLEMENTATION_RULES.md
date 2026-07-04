# Codex Implementation Rules

These rules are mandatory for Codex or any AI/code agent working in Hatid.

## Core rules

1. Do not rewrite the whole app.
2. Do not add unrelated UI.
3. Do not claim production readiness for mock behavior.
4. Do not suppress TypeScript, ESLint, or build errors.
5. Do not commit secrets, `.env` files, service account keys, private credentials, or provider secrets.
6. Do not make the client authoritative for trips, dispatch, payments, payouts, wallet balances, driver availability, admin overrides, safety cases, or compliance data.
7. Do not integrate SpeedCash as a live payment, payout, wallet, remittance, or cashout rail unless a dedicated due-diligence phase is approved.
8. Do not build AI before the operational core is safe.
9. Keep patches small and reviewable.
10. Add or update tests with behavior changes.
11. Preserve existing routes unless explicitly instructed otherwise.
12. Report build, typecheck, lint, test, and audit status honestly.

## Required reading before coding

- `00_PROJECT_SOURCE_INDEX.md`
- `02_CURRENT_REPO_AUDIT.md`
- `03_PRODUCTION_ARCHITECTURE.md`
- `07_DATABASE_SCHEMA.md`
- `08_TRIP_STATE_MACHINE.md`
- `11_PAYMENT_LEDGER_AND_PAYOUTS.md`
- `15_SECURITY_AND_RBAC.md`
- `18_IMPLEMENTATION_ROADMAP.md`

## Phase discipline

### Phase 0 only

Allowed:

- docs
- repo identity cleanup
- mock/demo labeling
- README cleanup
- build config honesty
- safe file organization

Not allowed:

- real payment integration
- SpeedCash live integration
- dispatch implementation
- wallet balances
- payout automation
- AI decision features

### Phase 1

Auth/profile correctness only.

### Phase 2

Data model and write boundaries only.

### Phase 3

Trip state machine only.

### Phase 4+

Only proceed if previous phase acceptance criteria are met.

## Required checks

Run these when available:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:high
```

Lint, typecheck, tests, and build are mandatory blockers before merge. Audit may temporarily be report-only until the dedicated dependency-hardening PR lands, but audit failures must still be reported honestly.

## Required Codex output format

Every Codex run must report:

- files changed
- why each file changed
- tests added/updated
- commands run
- typecheck result
- lint result
- test result
- build result
- audit result
- known risks
- next recommended step

## Failure rule

If blocked, say exactly what is blocked and why. Do not invent success.
