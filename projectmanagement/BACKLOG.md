# Feature and defect backlog

Updated: 2026-09-08. Tech lead sets priority/sprint; light maintains evidence and state. P0 means immediate integrity/release concern; P1 means next essential product capability; P2 is useful expansion; P3 is optional. States describe observed work, not intention. Nothing below is implemented merely because it is READY.

## Authorized sprint

| ID | Priority / state | Feature and why | Acceptance / dependencies | Sprint / owner |
| --- | --- | --- | --- | --- |
| DC-001 | P0 / READY | Strict Draw.io support profile; prevent empty-success imports and cross-page/parent corruption | S001 profile enforced; T01–T03, T14; baseline A03/A04 | S001 M1 / medium |
| DC-002 | P0 / READY | Strict, atomic patch engine with exact IDs; make AI changes predictable | All op types/fields validated, rollback, collision rejection and preservation; T04–T08; A01/A02 | S001 M1 / medium |
| DC-003 | P1 / READY | Consistent workspace and reliable loads; preserve the user's current work | Validated replacement, provenance/filename, errors, race protection and modified replacement; T09; A05 | S001 M2 / medium |
| DC-004 | P1 / READY | Review and bounded undo; make changes inspectable/recoverable in a session | Revision/text-bound candidate, effect summary, exact restoration; T07/T10/T11; depends DC-002/003 | S001 M2 / medium |
| DC-005 | P1 / READY | Template content tied to build; local branch and deployed app use the right files | All five bundled from one canonical location, external GitHub blocked test passes; T13; A06 | S001 M2 / medium |
| DC-006 | P1 / READY | Truthful export/editor/copy UX; complete the actual round-trip | Current-file download/reimport, filename retained, source links clarified, errors accessible; T12/T13/T16; A07 | S001 M2–M3 / medium |
| DC-007 | P0 / READY | Repeatable tests and CI; replace build-only confidence | Lockfile, supported Node, domain/browser journeys, CI and reports; T15 and full matrix; A08 | S001 M1–M3 / medium; independent verification light |

## Ordered roadmap — not yet authorized

| ID | Priority / state | Capability and reason | Definition of success / dependency | Candidate stage |
| --- | --- | --- | --- | --- |
| DC-008 | P1 / PLANNED | Source-bound AI protocol and complete copy prompt | Lead specifies versioned identity/fingerprint envelope, stale/different-source refusal, migration of v1 and clear AI instructions; copied response tested after intervening edits/load | S002 after S001 acceptance |
| DC-009 | P1 / PLANNED | Recover local work across reloads | Versioned local draft storage with restore/discard, quota/availability failure handling and clear save states; no silent overwrite; depends workspace contract | S002 candidate |
| DC-010 | P1 / PLANNED | Import ordinary compressed Draw.io files | Bounded decompression, fixture-backed classification and preservation; no silent failure or unbounded expansion | S003 compatibility tranche |
| DC-011 | P1 / PLANNED | Multiple pages and layers | Page-scoped IDs/patches, explicit page/layer selection and preservation of inactive pages; depends protocol decision | S003 compatibility tranche |
| DC-012 | P1 / PLANNED | Groups, containers and wrapped metadata cells | Model identity/parent hierarchy and deletion policy; preserve metadata and connectors; lead-approved compatibility fixture set | S003 or later; after DC-011 design |
| DC-013 | P2 / PLANNED | Useful architecture guidance per template | Each pattern has use case, assumptions, tradeoffs, limitations, provenance and review date; verify cloud-specific claims against primary provider docs | S004 content tranche |
| DC-014 | P2 / PLANNED | Real catalog previews and better discovery | Preview represents canonical file; filters/tags/empty states scale; asset update process reproducible | S004 candidate; after stable template pipeline |
| DC-015 | P2 / PLANNED | Provider shapes/icons | Review licensing/provenance, keep editable Draw.io stencils and test availability/exports; no custom renderer | After DC-013/014 |
| DC-016 | P2 / PLANNED | Edit current working XML directly in Draw.io embed | Origin/source-validated load/save/cancel protocol, actual draft transferred, revision conflict handling; diagram editor remains external | After compatibility/recovery, lead design required |
| DC-017 | P2 / PLANNED | Broader browser/accessibility/performance qualification | Agreed browser matrix, keyboard/screen-reader tasks and measured limits with larger real diagrams | Expand alongside usage; S001 has basic checks |
| DC-018 | P3 / DEFERRED | Optional Git publishing/PR workflow | Explicit user save action, authentication design, branch/ref awareness and conflict handling; no hidden writes | Only on a demonstrated user need |
| DC-019 | P3 / DEFERRED | Optional direct AI/MCP automation | Reuse proven patch contract with privacy/cost/failure decisions; core copy/paste stays usable | Only on a demonstrated user need |

S002–S004 are sequencing hypotheses, not promises to ship every row together. The lead sizes the next sprint from actual effort, defects and user feedback. In particular, broad XML compatibility may require multiple substantial sprints.

## Defect intake and audit follow-up

Baseline findings A01–A08 are tracked in [the initial audit](reports/2026-09-08-baseline-audit.md) and mapped above. Light updates their verification through a report rather than rewriting the original evidence. New defects use `BUG-001`, `BUG-002`, etc., with severity, affected revision, expected/actual result, reproducer, owner, state and retest link. No new QA defects have been recorded yet.

## Scope and decision queue

- No product clarification blocks S001: use the existing README as the vision. If the user wants cloud deployment, collaboration or a custom diagram editor, route that product change to the lead before implementation.
- Legacy v1 stale-response detection remains a known limitation, owned by DC-008; review/undo must not be described as solving it.
- Record feedback on development pass length at the lead review: actual completed milestones, interruption count and whether the user had to send unnecessary continuation messages. Adjust the next sprint package, not its correctness gate.
