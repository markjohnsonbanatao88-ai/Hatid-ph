# Design System Import Audit

## Source bundle

- **Bundle name:** `Hatid-ph Design System.zip` (the Claude design export "Hatid-ph Design System.dc.html").
- **Companion bundle:** `Hatid Design System.zip` (an older Agent-Skill form of the same system containing `SKILL.md`, React component specimens, and interactive UI kits).
- Both bundles describe the **same** token foundation. This import is grounded in the `_ds/.../tokens/*.css` files and the bundle `readme.md`.

The bundle positions Hatid as a premium, light, trustworthy Philippine ride-hailing presentation layer for three surfaces - Rider app, Driver app, and a **spec-only** Admin/operations console.

## Imported design concepts

Imported into `src/app/globals.css` as an **additive, namespaced** token layer only:

- **Color tokens** - brand palette (`--hatid-primary` red `#E4002B`, `--hatid-navy` `#002F87`, ink `#0A1E5C`, `--hatid-yellow` `#FFD100`), surface ramp (`--surface-canvas/-raised/-muted`), text ramp (`--text-primary/-heading/-secondary/-muted/-faint/-inverse`), hairline borders, and a sparingly-used status set.
- **Typography scale** - Inter family token plus the display->caption size scale, weight scale (400-900), line-heights, and tracking (title `-0.02em`, eyebrow `0.18em`).
- **Spacing tokens** - 4px-base rhythm (`--space-xs`...`--space-2xl`) and a `44px` minimum `--touch-target`.
- **Radius tokens** - controls `14px`, cards `24px`, sheets `32px`, pill.
- **Shadow tokens** - restrained single-layer `card`/`elevated`/`nav`/`primary` elevations and a focus ring.
- **Motion** - `fade` (180ms) + `slide-up` (220ms) keyframes and `.animate-hatid-*` utilities, both disabled under `prefers-reduced-motion`. No pulse/bounce/shimmer.

## What was implemented

- Added the token block above to `src/app/globals.css` under a clearly-labelled "Hatid Design System - imported foundation tokens" section.
- All imported custom properties are **namespaced** (`--hatid-*`, `--surface-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`) so they **do not override** the live shadcn theme (`--primary`, `--background`, `--radius`, etc.) that currently renders the app.
- Added `tests/design-system-tokens.test.ts` verifying that (a) the imported tokens are present, (b) the live blue `--primary` theme is untouched (no silent re-skin), and (c) rider prototype-honesty copy remains intact.
- Created this audit document.

Net rendered-pixel change to existing product pages: **none** - no existing selector consumes the new tokens yet.

## What was intentionally NOT implemented

- **The blue -> red re-theme.** The bundle re-themes the app's primary from the current blue (`--primary: 223 84% 61%`) to red `#E4002B`. Flipping the live `--primary` token would re-skin every product surface at once. That is a deliberate design decision and is **deferred pending explicit sign-off** - the red palette is imported only as inert `--hatid-*` tokens.
- **Interactive UI kits** (`ui_kits/rider`, `ui_kits/driver`). These are full booking-flow and driver-dashboard recreations - i.e., booking flows, ride lifecycle, driver-online logic, and live-map surfaces - which are out of Phase 0 scope and would make mock behavior look live.
- **Product components** from the bundle (`RideCard`, `DriverCard`, `LocationCard`, `SafetyCard`, `AppHeader`, `BottomNav`, `BottomSheet`). Adopting these would imply live rides, live dispatch, live fares, or live safety operations.
- **Compiled runtime** (`_ds_bundle.js`, `support.js`) - opaque generated code; not imported.
- **External Google-Fonts `@import`** from the bundle's `fonts.css`. The app already references Inter via `--font-inter`; the import maps `--hatid-font-sans` to Inter with system fallbacks rather than adding a new network font request.
- **Admin/operations console UI** - spec-only in the bundle and in the repo; nothing built.
- No component normalization was applied to `src/components/ui/*` (changing shared Button/Card/Input radii would visually re-skin product pages).

## Risks

- Any future PR that points the live `--primary`/radius theme at the `--hatid-*` values will re-skin the entire app; that must be a reviewed, intentional change with design sign-off, not an incidental token cleanup.
- The bundle's `readme.md` references source paths that do **not** exist in this repo (`src/design-system/*.ts`, `docs/16_UI_UX_SYSTEM.md`). Do not treat those references as authoritative for this repo's structure.
- `brand-preview` already hardcodes a different blue (`#0033CC`); token adoption should eventually replace such hardcoded hex values, but that is deferred.
- Status colors must never be used as the only signal (accessibility); enforce icon + text pairing when these tokens are eventually adopted.

## Future UI work that must wait for backend authority

The following are **not** unblocked by this import and must wait for real, server-owned backends:

- Live rider booking, ride-options, and ride lifecycle screens.
- Driver online/availability logic and driver dashboard.
- Live maps, routing, fare, and dispatch UI.
- Wallet balances, payments, payouts, earnings, and trip-history that imply real money or real history.
- Admin/operations console and safety/SOS operations UI.

Adopting the design system's visual polish for any of the above does not make the underlying behavior real.

## Reminder

UI polish is **not** product truth. A cleaner token system, nicer type, and restrained shadows do not create authoritative trips, dispatch, payments, wallets, payouts, safety operations, or compliance. Hatid remains **prototype only**. The client is never authoritative for those systems; see `docs/02_CURRENT_REPO_AUDIT.md` and `AGENTS.md`.
