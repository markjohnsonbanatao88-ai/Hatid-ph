/**
 * Single source of truth for the rider prototype's honesty-boundary copy.
 *
 * These strings state the production boundaries of the Phase 0 prototype:
 * dispatch is simulated, fares are estimates, the wallet is preview-only,
 * payments are never charged, trip state is not client-authoritative, and
 * safety actions are visual-only until backend workflows, audit logs, and
 * operators exist.
 *
 * `src/app/page.tsx` renders these strings and
 * `tests/design-system-ui-adoption.test.ts` asserts they keep stating those
 * boundaries. Reword freely, but a change that drops a boundary fails the test.
 */
export const PROTOTYPE_HONESTY_COPY = {
  dispatchSimulatedStatus: 'Simulated status - not live dispatch',
  dispatchPermissionCopy:
    'Permission copy is demo-safe and does not imply live emergency or dispatch operations.',
  serverWorkflowsBeforeRealUse:
    'Fare, dispatch, driver assignment, and wallet charging must be confirmed by server workflows before real use.',
  fareEstimatesForPrototype: 'Fares and ETAs shown are estimates for prototype review.',
  fareServerPricedLater: 'Server-priced later',
  fareServerOwnedLater: 'Server-owned later',
  paymentNotCharged: 'Not charged',
  walletPreviewOnlySubtitle: 'Preview only - no live balance',
  walletLedgerOwnedLater: 'Ledger-owned later',
  walletNoMoneyMovement:
    'This wallet screen is safe for prototype review. It does not move, hold, charge, refund, or reconcile money.',
  tripCompletionPrototype:
    'Trip completion is a prototype state. Receipt and fare records must be server-generated.',
  tripStateNotClientAuthoritative: 'Not client-authoritative - server-owned later',
  safetyVisualOnly:
    'Safety actions are visual only here. Real incident handling needs backend workflow, audit logs, and operator escalation.',
} as const;

export type PrototypeHonestyKey = keyof typeof PROTOTYPE_HONESTY_COPY;
