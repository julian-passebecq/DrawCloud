# Git inventory and evidence

Observed 2026-09-11 on this machine. Repository: https://github.com/julian-passebecq/DrawCloud.

## Preserved work and provenance

| Work | Evidence / disposition |
| --- | --- |
| Prototype and five templates | Already pushed on `main` at `409d82415f17cfe899267bd981c317067a798d59`. Git history attributes the commits to Julian Passebecq; the exact originating AI is not established. Includes build CI, Netlify config and the Vite plugin fix. |
| First testing task, “Test it” (`01a081c8-cc52-76e0-8f46-51746a03fa9c`) | Interrupted after inspecting code and installing dependencies in the detached test worktree. No completed certification or source changes found. |
| Second testing task, “Test it” (`01a081cb-e3dc-72b3-908c-c4c734767c25`) | Completed smoke testing on September 8; no source changes. Results below. |
| Tech-lead task, “Plan AI-led development sprints” (`01a08249-6025-7bc1-bd49-bc901ea487a7`) | Wrote AGENTS.md, README coordination link and 10 projectmanagement documents: architecture, backlog, S001 scope, test plan, workflow, ledgers and audit/report templates. Originally uncommitted; preserved unchanged in commit `361a5f4` on this takeover branch. Product unchanged. |
| Current handover task | Inspected source, Git and prior task records; preserved planning, added this packet and updated current instructions/status for single-Pro ownership. No product fixes, dependency changes or new product acceptance. |

The role labels above are recorded responsibilities, not inferred model identifiers.

## Unpushed-work audit

`git fetch origin` succeeded. Live `git ls-remote --heads origin` initially showed only `main` at the product revision above. Local branches initially contained only main, equal to origin/main. No stashes or unreachable objects were reported by `git stash list` / `git fsck --no-reflogs --unreachable`.

Two registered worktrees were inspected:

- `D:/PROJ/DrawCloud`: initially main with modified README and untracked AGENTS.md/projectmanagement; all are preserved on the takeover branch. Only ignored node_modules, dist and build-test.log were additionally present.
- `D:/PROJ/DrawCloud-test`: detached at the same product revision, no tracked/untracked source changes, only ignored node_modules. Created by the interrupted testing task; left untouched.

The task-list API only surfaced recent tasks. A read-only local Codex task-index query for DrawCloud paths/titles found the three older tasks above plus this handover. Their histories were inspected through the task API. No separate developer delivery, extra checkout or unpushed agent code was found. No other tasks were launched or messaged. This audit covers the connected local task records and registered worktrees; unavailable cloud sessions, other computers and unrelated unregistered clones cannot be certified.

Ignored dependencies and generated bundles remain local and are not source deliverables. The old build log is summarized below; it is not a missing feature or required upload. No credentials or private local task transcripts are included. No user-side push is needed for the work found here once this takeover branch is verified on origin. Main is unchanged; no merge or deployment is performed. Use this branch, not main, for the handover.

## Test evidence and limits

Product revision for all historical checks: `409d82415f17cfe899267bd981c317067a798d59`; current branch changes only documentation.

| Check | Evidence / result |
| --- | --- |
| September 8 completed testing task | Reports production build, five template XML/unique-ID/connection checks, search/provider filters, GitHub template loading, all five patch operations, missing-node errors and geometry/style preservation passed. Confirmed unknown operations silently succeed. Historical manual smoke evidence, not a reproducible suite. |
| September 8 tech-lead audit | Separately reports `npm run build` passed in 23.68 seconds; source audit A01–A08. Explicitly did not perform browser or patch runtime tests in that audit. |
| Existing ignored build-test.log | Ends with successful Vite build in 19.62 seconds. No embedded immutable revision stamp; supports the old task report, not independent current certification. |
| Environment | Node 21.7.1 / npm 10.5.0 observed again September 11. Historical installed Vite warned that this Node is unsupported. Default shell initialization also has Conda/Python errors; non-login PowerShell works. No global repair attempted. |
| September 11 handover verification | Git inventory/fetch/fsck, source inspection, document-link/whitespace checks and five-template structural check. Passed: relative links in 14 Markdown documents, git diff --cached --check, all five XML templates parsed with unique cell IDs and intact edge references. Product diff against baseline is empty. No production build or browser suite rerun for documentation-only changes. |

No automated test script or committed lockfile exists. CI uses Node 22, npm install and npm run build; it triggers on main pushes and pull requests, so a push to the handover branch alone does not run CI. CI result and deployed-site state were not verified. Supported-environment reproducibility, complete S001 matrix T01–T16, independent adversarial checks and final release qualification remain outstanding. No sprint is accepted.
