# NovaRide mobile UI audit

Scope: the main `frontend` application. Backend, authentication, role selection, routing, ride state, API requests, Socket.IO, maps and payment handlers were preserved. The separate admin application was excluded as requested.

## Causes and shared corrections

The main causes were desktop-sized typography and padding used as mobile defaults, repeated page/card gutters, 9–11px labels, fixed-width controls, flex rows that could not shrink, and dialogs without viewport height constraints. A fixed-width decorative FAQ glow caused page overflow. The wallet withdrawal overlay inherited a dashboard ancestor's containing block, placing it below the viewport.

| Area | Result |
| --- | --- |
| Global styling | `src/tailwind.css` imports `src/styles/mobile.css`, which defines shared mobile typography and spacing utilities. |
| Font | Self-hosted variable Inter, weights 400–900, Latin and extended Latin subsets including the naira symbol; license included. Mobile-only Latin preload and `font-display: optional` avoid a late font swap. Existing desktop font styling remains. |
| Typography | Below 640px: body 14–15px, captions at least 12px, compact heading scale from 18–28px, shared buttons 14px. Text inputs, selects and textareas use 16px. |
| Spacing | Shared 12px page gutters, 16px card padding and 16px content gaps. Existing larger spacing is restored with responsive classes. Redundant mobile spacing inside already padded landing/footer sections was removed. |
| Navigation | 56px mobile bar, 32px-high logo, compact login action, 44px menu toggle, smaller gaps and a viewport-bounded scrollable mobile menu. Role-dependent destinations are preserved. |
| Shared controls | `Button`, `Input`, `ScaledButt`, `Navbar`, `Nav`, profile sidebar controls and floating chat support use compact responsive sizing. Shared inputs remain at least 48px high; shared buttons at least 44px. |
| Overflow | Shrinkable location inputs, stacked narrow-screen rows, fluid OTP controls, responsive fixed-width controls, bounded decorative backgrounds, and local scrolling for the payment ledger. No global horizontal-overflow hiding was added. |
| Dialogs | Viewport height limits and internal scrolling support short screens. Withdrawal markup is rendered through a React portal into `document.body` so it is centered in the viewport; payment logic is unchanged. |
| Wrappers | No structural wrappers were removed. Existing positioning, animation and event boundaries were retained; repeated padding was reduced through classes. |

## Pages and components reviewed and updated

| Group | Coverage |
| --- | --- |
| Public pages | Landing hero, ride/rider/installment promotional sections, how-it-works, footers, FAQ, help/complaint form and installment terms. Hero preloading and crossfade behavior remain intact. |
| Authentication | Login, signup, password recovery/OTP and new password; stacked fields, compact inputs and usable password toggles. |
| Passenger rides | Booking/sidebar/location search, driver selection/cards/list, confirmation, ride summaries, incoming request, tracking, ride controls and completion. Long routes wrap; fare rows retain readable values. |
| Rider | Dashboard, incoming passengers, journeys, chart, transactions, wallet panel, onboarding personal/vehicle/document forms and ride request dialog. |
| Installment | Dashboard, application, onboarding steps, guarantors, documents, plan, payment/bank forms, calculator, payment progress, ledger and vehicle details. Step labels appear only where space permits. |
| Account and wallet | Profile, security, notification and privacy panels; wallet overview, transactions and withdrawal dialog. |
| Overlays | Support panel, navigation menu, ride start/completion/request/status and withdrawal dialogs. |

The compact typography applies below 640px. Existing `sm` styling resumes at 640px; `md` layouts resume at 768px. Existing larger breakpoints remain, with onboarding step labels deferred to `lg` to prevent crowding on tablets.

## Validation

- Production build: passed. The existing warning about JavaScript chunks exceeding 500kB remains.
- Route audit: 20 routes at 320, 360, 375, 390, 414, 430, 640, 768 and 1366px: 180 combinations, no document horizontal overflow or uncaught runtime exceptions in the final run.
- Interactive states: navigation menu, support panel, profile/security/notification/privacy panels, withdrawal dialog, transactions, vehicle details and payment ledger: 40 additional checks at 320, 375, 640 and 768px with a 568px viewport height.
- Isolated component audit: guarantor, document, plan, bank/payment, rider document and vehicle forms, selected driver card, and four ride dialogs: 99 combinations across the same nine widths. Included long names/addresses, fee details and validation messages. No document overflow or runtime exceptions; dialogs fit within the short viewport and scroll internally.
- All measured mobile text controls use at least 16px. Desktop heading dimensions and font values sampled across the 20 routes match the pre-change baseline at 1366px.
- Screenshots were captured before and after, with visual inspection of booking, login, wallet, installment onboarding, guarantor fields, driver details and ride dialogs.
- Source comparison: all 67 changed JSX components retain their non-presentation AST after accounting for CSS/accessibility attributes and the withdrawal portal wrapper. Existing handlers, content and request logic were compared. ESLint comparison reports the same 65 pre-existing messages in these files and no introduced messages. `git diff --check` passes.
- The frontend has no existing automated test script. Browser checks used headless Microsoft Edge/Chromium with isolated API fixtures; no live payments, uploads, ride mutations or messages were sent.

Before/after examples at 375px:

| Page | Before | After |
| --- | --- | --- |
| Booking | [Screenshot](mobile-ui/booking-before.png) | [Screenshot](mobile-ui/booking-after.png) |
| Installment setup | [Screenshot](mobile-ui/installment-before.png) | [Screenshot](mobile-ui/installment-after.png) |

## Limits and remaining issues

No further document overflow was found in the tested routes and component states. Real iOS Safari, Android keyboard behavior, external payment UI, live map tiles and live socket/payment integrations were not exercised. The existing lint findings, large JavaScript bundle and large image assets remain outside this layout task. Image placeholders in some fixture screenshots are test-data artifacts.
