# PORTAL — Community Portal Builder Final-Product Roadmap

**Document type:** Living final-product / launch roadmap  
**Status:** Planning and product-direction source of truth; items are not active until implemented and tested  
**Product:** Community Portal Builder (CPB) for Robinhood Chain  
**Last updated:** 2026-08-15

This file replaces the former SHELL roadmap. From this point forward, final-product phases, launch/commercialization decisions, ecosystem direction, and future-product notes should be maintained here while `README.md` continues to record implemented and tested development progress.

## 1. Final-product direction

CPB is moving toward a public product for Robinhood Chain communities: projects choose a Token, NFT, or Token + NFT baseline, enable the modules they need, configure their project, preview the result, and create/deploy a complete portal through the simplified four-stage flow:

```text
Project → Modules → Details → Deploy
```

Builder Mode remains preserved underneath as the advanced/fallback reference until the final product no longer needs that compatibility layer.

The generated/exportable project remains an important ownership/fallback capability even if a centrally hosted product later becomes the normal public experience.

## 2. PORTAL token direction

The planned CPB ecosystem token is **PORTAL**, not SHELL.

Current product decision:

- paid CPB modules should be purchasable with **PORTAL or ETH**;
- PORTAL should be positioned around genuine CPB/platform utility rather than being introduced as a meme token;
- exact pricing, discounts, treasury handling, token-contract design, accounting, and any other token-economic mechanics remain **TBD** until they are deliberately designed and implemented;
- no token/payment claim should be presented publicly as active before the contracts, backend verification, accounting, and user-facing behavior implement it exactly.

The payment layer should be designed so that entitlement is based on verified server-side/on-chain state, not browser-local state.

## 3. Launch promotion — First 3 Projects Free

CPB should launch with a limited introductory promotion:

> **The first 3 distinct projects/communities to successfully complete their first real CPB portal creation/deployment receive the full portal for free.**

Promotion rules:

- this is a **global launch promotion**, not three free builds per user;
- the promotion state must be persisted **server-side** and shared across users/devices;
- track both the counter and the project IDs that claimed a slot;
- one distinct project may consume only one free slot;
- Preview Portal does **not** consume a slot;
- failed creation/deployment does **not** consume a slot;
- rebuilding, updating, or redeploying the same claimed project does **not** consume another slot;
- a slot is consumed only after the project's first qualifying real portal creation/deployment succeeds;
- state progresses automatically from **3 remaining → 2 → 1 → promotion ended**;
- once all three qualifying projects are recorded, CPB automatically stops granting the free-launch entitlement.

Implementation must use an atomic server-side claim operation so two simultaneous successful projects cannot accidentally claim the same final slot.

## 4. Paid-module model

After the introductory launch promotion, CPB's paid capabilities should support payment in either:

```text
PORTAL
or
ETH
```

The exact paid/free module boundary is not locked yet. Before implementation, define:

- which modules are always included in the base portal;
- which modules are premium;
- one-time purchase vs recurring access rules;
- PORTAL and ETH pricing presentation;
- payment confirmation/finality requirements;
- entitlement persistence across project updates and redeployments;
- refund/failure handling;
- wallet/account ownership model.

Paid-module access must never rely solely on frontend flags or local storage.

## 5. CPB domain decision

The final product needs a memorable public domain. The domain should feel like a **product/platform**, not a temporary developer deployment URL.

Naming directions to explore during the final-product phase include:

- **CPB-forward:** names containing `cpb`, `communityportal`, or a short builder-oriented variant;
- **PORTAL-forward:** a concise domain that makes PORTAL the ecosystem/product identity while CPB remains the builder name;
- **Robinhood-Chain-contextual:** a name that signals the target ecosystem without making the product look unofficially owned by Robinhood;
- **neutral platform brand:** a short, ownable brand that can host both the builder and generated community portals.

Decision criteria:

1. short and easy to type;
2. easy to pronounce and remember;
3. no confusing spelling;
4. suitable for both CPB itself and generated portal URLs;
5. clean route/subdomain possibilities;
6. no misleading ownership/affiliation implication;
7. sensible renewal cost and registrar control;
8. domain and major social-handle availability checked at decision time.

**Do not lock a domain from roadmap brainstorming alone.** Availability, trademark/brand risk, renewal price, and route architecture should be checked when the final naming shortlist is reviewed.

## 6. Public route / hosting architecture candidates

A central route model remains attractive for the final product. Example only:

```text
<cpb-domain>/
<cpb-domain>/builder
<cpb-domain>/projects

<cpb-domain>/<project>
<cpb-domain>/<project>/whales
<cpb-domain>/<project>/intel
<cpb-domain>/<project>/nft
<cpb-domain>/<project>/nft/terminal
```

The current accepted NFT-only generated routes remain:

```text
/nft
/nft/terminal
```

Architecture candidates:

### A. Separate deployment per project

Current connected-deployment model: a generated project is published to its own GitHub repository and hosting service.

**Strengths:** strong isolation, straightforward project ownership, current workflow already exists.  
**Trade-offs:** deployment time, service count, operational overhead, and hosting cost grow with every project.

### B. Central multi-tenant CPB platform

Projects are stored as configuration records and a shared runtime renders project routes.

**Strengths:** faster publishing, centralized upgrades, easier promotion/payment enforcement, lower per-project deployment overhead.  
**Trade-offs:** requires robust persistence, ownership, isolation, abuse protection, caching, backups, migration strategy, and production operations.

### C. Hybrid

Normal projects use central CPB hosting while advanced/premium users retain export or standalone deployment options.

This remains a strong candidate because it combines a simple public product with project portability.

## 7. Render vs paid production hosting

Render is appropriate for the current testing/development stage and has already proven useful for connected CPB deployment. The final-product phase should explicitly decide whether to keep Render for production or move to another paid production platform.

Evaluate the decision using evidence from real CPB usage rather than changing hosts just because launch is approaching.

### Keep/upgrade Render if

- deploy reliability is consistently good;
- build/deploy latency is acceptable;
- persistent services/databases meet CPB needs;
- custom domains/SSL work cleanly;
- observability, secrets, scaling, backups, and cost are sufficient;
- connected GitHub deployment remains operationally simple.

### Consider another paid platform if

- cold starts or deploy times hurt the product experience;
- multi-tenant architecture needs infrastructure Render does not fit well;
- database/queue/object-storage requirements become awkward;
- stronger regional performance, autoscaling, observability, or operational controls are required;
- projected cost at expected project volume is materially better elsewhere.

### Hosting decision process

Before public launch, compare at least:

- Render paid services;
- one managed application/container alternative;
- one platform optimized for the final selected CPB architecture.

Compare real monthly cost, build/deploy speed, runtime latency, custom-domain support, managed database options, secret handling, logs/metrics, backup/restore, scaling, support, and migration complexity. Keep the current Render integration working until a replacement has passed an equivalent end-to-end deployment test.

## 8. Final-product phases

These are planning phases, not commitments to exact chapter numbers. Chapter 22C remains the current functional/regression-test chapter.

| Phase | Goal | Status |
|---|---|---|
| A | Finish Chapter 22C functional + mobile regression testing | **CURRENT** |
| B | Final UI decisions: Load/Save area, mobile polish, final responsive acceptance | PLANNED |
| C | Final CPB domain shortlist, availability/brand checks, domain selection | PLANNED |
| D | Production architecture decision: separate deployments vs central vs hybrid | PLANNED |
| E | Production hosting decision: Render paid vs alternative service | PLANNED |
| F | Identity/ownership + durable project persistence | PLANNED |
| G | First-3-projects-free server-side promotion tracking | PLANNED |
| H | PORTAL + ETH paid-module entitlement/payment layer | PLANNED |
| I | Security hardening, abuse/rate protection, monitoring, backups, recovery | PLANNED |
| J | Trusted-user/beta acceptance on Robinhood Chain | PLANNED |
| K | PORTAL/CPB public launch | PLANNED |

The order may be refined as testing exposes dependencies. Payment and promotion tracking should not be shipped before durable server-side project identity/persistence exists.

## 9. Current final-product UI notes

Carry these into the final-product phase while Chapter 22C continues to test the current UI:

- **Mobile readiness:** every CPB screen must be fully responsive with no clipping, overflow, bad fitting, broken spacing, unusable controls, or mobile-only styling regressions.
- **Load / Save area:** discuss and finalize its public-product layout, placement, labels, prominence, and behavior. The current presentation is not assumed to be final.
- Preserve the accepted four-step **Project → Modules → Details → Deploy** experience unless testing proves a usability defect.
- Preserve simple baseline/module selection language and NFT progressive disclosure.
- Keep advanced/developer complexity out of the normal-user path wherever possible.

## 10. Current module philosophy

The product should provide community-specific value rather than become a generic trading dashboard.

Current/future module families include:

- **Landing Page** — identity and essential project/token information;
- **Whale Tracker** — holder concentration and large-wallet behavior;
- **Meme Intel** — project/community intelligence;
- **NFT Portal / Terminal** — dedicated NFT experience;
- **Timeline / Logbook** — meaningful chronological project history;
- **Community Pulse** — explainable synthesized project/community signals.

A useful filter for future modules remains:

> Does this tell the community something useful about its own project that would otherwise require several sites or manual investigation?

### Community Pulse direction

Potential explainable signals:

```text
[ POSITIVE ] Holder count rising
[ FLOW ]     Top wallets net accumulating
[ ACTIVE ]   New wallets entering
[ NFT ]      Collection activity elevated
[ WATCH ]    Top-10 concentration increased
[ TREASURY ] Meaningful treasury movement detected
```

Avoid opaque scores unless their methodology is transparent and defensible.

### Timeline / Logbook direction

Potential events:

- token/project launch;
- NFT mint;
- holder milestones;
- volume/activity records;
- burns or supply changes;
- listings;
- treasury events;
- governance events;
- verified announcements;
- other meaningful project milestones.

The goal is attributable project history, not noisy scraping.

## 11. Other future command/module candidates

Exploratory candidates include:

```text
holders       Holder distribution and concentration
buyers        Meaningful recent accumulation
sellers       Meaningful recent distribution
newwallets    Newly entering wallets
smartmoney    Notable wallet activity, with responsible definitions
flows         Net movement into/out of tracked wallet groups
activity      Unusual on-chain activity
milestones    Holder, volume, burn, supply, or NFT milestones
treasury      Public treasury activity
links         Verified ecosystem links
status        Contract/network/API health
announcements Verified project/community updates
calendar      Upcoming project/community events
verify        Official contract/link verification
alerts        User-defined notable-event thresholds
```

Future additions should be validated with real Robinhood Chain communities before being promoted into the core module set.

## 12. Possible production infrastructure components

Depending on the architecture selected, the final product may need:

- one or more web/Node services;
- PostgreSQL or equivalent durable project/configuration persistence;
- object storage for project assets;
- server-side caching for RPC/API data;
- wallet/account identity and ownership;
- PORTAL/ETH payment verification and entitlement records;
- atomic launch-promotion claim tracking;
- rate limiting and abuse protection;
- production logs, metrics, alerting, and error tracking;
- backups and tested recovery;
- GitHub for source/release management where useful;
- Render or another production host;
- managed DNS/SSL/CDN/protection where useful.

External RPC/API reliability and provider limits may become a larger scaling constraint than raw CPU, so caching, deduplication, timeouts, fallbacks, and provider-health behavior should be designed deliberately.

## 13. Documentation rule from this point forward

- **`README.md`** = implemented/tested history, current source-of-truth build notes, regressions, operational behavior.
- **`PORTAL.md`** = living final-product direction, future phases, commercialization/payment/launch notes, domain/hosting decisions and unresolved product choices.
- The former **SHELL roadmap is retired and should not be recreated**.

When a final-product roadmap item moves into implementation, add its real implementation/test result to README while keeping PORTAL.md updated to reflect the remaining plan.


## Generated Community Portal visual baseline — Chapter 22C Test-1
- `PROJECT` always means the **Project Name entered in CPB**.
- Generated landing title: `<Project Name> Community Portal`.
- Main project title is always Neon Green and the project logo is centered.
- Portal surfaces should be elegant but visibly colorful: Robinhood lime/neon green plus meaningful orange, violet and aqua accents.
- Preview Portal must visually represent the current generated portal, not a legacy terminal template.
- Generated Community Portal footer reuses CPB visual DNA: two energy lines above it, `<Project Name> Community Portal`, `Built using Community Portal Builder`, and `Build. Launch. Grow.`
- Deployment UX stays product-facing; infrastructure vendor names should not appear in normal end-user progress copy.
- Confirmation phrase for the final deploy action is `CONFIRM DEPLOY`.

### Chapter 22C test behavior
- During QA, loading a saved project automatically satisfies the Public Acceptance gate so the saved project can continue through deployment testing without an unnecessary repeat prompt.


### Chapter 22C visual acceptance note — Pass 12.21
The generated Community Portal visual baseline now favors a more compact dashboard footprint, a shorter modern header, denser Market Snapshot/cards, and a compact lime creator footer carrying the Gokalp avatar + X credit. Live portal links remain disabled until final deployment success is confirmed.


## Chapter 22C Pass 12.22 visual standard
Generated portal pages share one canonical bottom signature: the same animated lime/violet divider pair as CPB followed by the 25/50/25 dark-blue / Robinhood-lime / dark-blue footer. The right creator panel uses the compact avatar, white creator text and ice-blue clickable X account.


### Chapter 22C Pass 12.23 — Signature footer refinement
- Refined the canonical 25/50/25 footer into a visually unified one-piece signature bar: dark-blue side zones with a curved Robinhood-lime center transition instead of three hard rectangular blocks.
- Right signature area now uses a true circular avatar, muted “Built by”, bright-white “Gokalp”, and an ice-blue clickable X handle.
- The same signature footer treatment is injected across generated portal pages; the canonical animated double-divider remains unchanged above it.


### Chapter 22C Pass 12.25 — footer rollback
- Cancelled the experimental 25/50/25 footer.
- Restored the canonical single Robinhood lime/yellow footer across CPB Preview and every generated portal page.
- Reduced footer visual footprint by approximately 25% while preserving the animated double-divider and creator signature.

- Chapter 22C Pass 12.26 visual rule: generated portal section titles inherit their section left-border accent; Landing Page hero/market/status polish validated as the current new-UI direction.

## Module portal analytics presentation rule — Whale Pass 2
- Analytical module commands may render a compact visual summary inside the existing result surface when the data benefits from visualization.
- Visuals must remain secondary to the underlying detailed output, use the accepted Landing Page design language, avoid new-page/modal flows, and collapse cleanly on mobile.
- Module-card and subsection titles inherit their own left-border accent color.

### Latest portal UI pass
- Fixed Community Pulse header drift by moving module-header rules into the shared canonical portal stylesheet.
- Updated Community Timeline to the accepted Portal UI standard.
- Timeline fresh-build behavior now includes objective starter milestones (portal creation and activated modules), plus configured NFT schedule milestones.
- Refined CPB deployment-success status line sizing/alignment.

## NFT Portal NEW UI Pass 2 acceptance candidate
- NFT Countdown + Collection Portal UI refined against the accepted Landing/Whales/Intel/Pulse/Timeline visual language.
- Preserve current NFT APIs, command IDs, countdown lifecycle, single/multi-phase behavior and compatibility routes during visual acceptance testing.
- Test case priority: Token + NFT, single-phase HOODRAT configuration, then multi-phase configuration, desktop + mobile.

### NFT NEW UI Final 5 — clean multi-phase status hero
- Multi-phase countdown hero now shows only one lifecycle message: `MINT COMPLETE`, `MINT LIVE`, or `MINT HAS NOT STARTED`.
- Removed duplicate phase summary, continuation prompt, and bracketed terminal-style hero labels.
- All previously accepted NFT UI, mobile ordering, header, Market Update, and CPB confirmation behavior remains unchanged.
