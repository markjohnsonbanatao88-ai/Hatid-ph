# Hatid Codex Rules

You are working on Hatid.

Hatid is a Philippines-focused ride-hailing, delivery, driver, dispatch, payment, payout, safety, admin, and compliance platform.

Treat this app as a prototype unless production readiness is proven by backend architecture, tests, CI, security rules, deployment evidence, and operational controls.

## Operating rules

- One ClickUp task equals one focused PR.
- Do not expand scope.
- Do not touch unrelated files.
- Do not rewrite the app.
- Preserve existing routes unless the task explicitly says otherwise.
- Keep patches small and reviewable.
- Add or update tests with behavior changes.
- Report changed files, tests, build result, risks, and unresolved questions.
- Do not claim production readiness for mocked behavior.

## Required checks

Run these when available:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:high
npm audit
```

Do not suppress lint, typecheck, test, or build failures.
Lint, typecheck, tests, and build are mandatory blockers before merge. Audit may temporarily be report-only until the dedicated dependency-hardening PR lands, but audit failures must be reported honestly.
Dependency changes must run lint, typecheck, tests, build, and audit. Do not use forced dependency upgrades without explicit justification.
Branch protection and required-check changes need evidence before being called complete.

## Production boundaries

Client code must not be authoritative for trips, dispatch, driver availability, payment status, wallet balances, payouts, admin overrides, onboarding approvals, safety incidents, or compliance data.

Supabase/PostgreSQL is the production source of truth. Production-critical state must be server-owned, auditable, and recoverable.

Firebase/Firestore must not be introduced for production-critical flows. Legacy Firebase references are historical only unless they are explicitly marked as legacy.

Do not claim production readiness until the required architecture, security, testing, CI, deployment, and operational controls are implemented and evidenced.

## High-risk work

Treat work as high-risk when it touches auth, rider accounts, driver accounts, booking flow, dispatch, location tracking, payments, balances, admin permissions, Firebase rules, storage rules, deployment, notifications, route assignment, or personal data.

High-risk work requires written scope, tests, CI evidence, review evidence, rollback notes, and human approval.

## Money and compliance

Money-related features must be ledger-based, server-authoritative, idempotent, auditable, and reconciled.

Do not treat screenshots, QR codes, or merchant dashboards as payment integration.

Philippines regulatory, privacy, tax, consumer protection, insurance, transport, safety, onboarding, and legal review areas must be identified for production planning.

## AI

AI is later. AI may assist, summarize, suggest, or classify. AI must not silently decide suspensions, refund liability, safety closure, driver approval, payout approval, fraud punishment, or legal/compliance decisions.

## Phase order

Phase 0: repo cleanup and honesty  
Phase 1: auth/profile correctness  
Phase 2: real data model and write boundaries  
Phase 3: trip state machine  
Phase 4: maps/geocoding/fare quote  
Phase 5: driver onboarding  
Phase 6: driver availability and dispatch  
Phase 7: payment ledger and receipts  
Phase 8: admin console  
Phase 9: safety tools  
Phase 10: payouts and reconciliation  
Phase 11: analytics and AI  
Phase 12: production hardening and launch readiness
