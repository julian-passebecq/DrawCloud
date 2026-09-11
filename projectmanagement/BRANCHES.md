# Branch, worktree and test ledger

Last observed: 2026-09-08 by tech lead, using local Git metadata only. No remote fetch or live PR inventory was performed. Remote tracking refs may be stale.

| Branch / state | Workspace | Observed HEAD | Owner / purpose | Test / review evidence | Remote or PR |
| --- | --- | --- | --- | --- | --- |
| `main` | `D:/PROJ/DrawCloud` | `409d82415f17cfe899267bd981c317067a798d59` | Existing main checkout; planning performed here | Baseline build passed with warnings; static audit only; new management docs uncommitted at handoff | Tracks repository with `origin/main`; no PR verified |
| Detached HEAD | `D:/PROJ/DrawCloud-test` | `409d82415f17cfe899267bd981c317067a798d59` | Existing worktree; owner/activity unknown | Working tree observed clean; no tests run there; do not assume free to reuse | No PR verified |
| `codex/s001-safe-roundtrip` — planned, not created | TBD by medium | Not started | S001 development | No candidate yet | No PR |

Origin: `https://github.com/julian-passebecq/DrawCloud.git`. Observed local branch list: `main`. Observed remote-tracking refs: `origin/main`, `origin/HEAD → origin/main`.

## Light model maintenance checklist

1. Inspect `git status --short`, `git branch -avv`, `git worktree list --porcelain` and `git log -1` in relevant workspaces without modifying other sessions' work.
2. Record branch, worktree, owner/purpose if known, base/HEAD and dirty state. Mark unknown ownership rather than guessing.
3. If remote/PR reads are available and relevant, inventory them and record observation time. Otherwise keep remote/PR state explicitly unverified. Never infer a complete server inventory from tracking refs.
4. Link each QA run to product revision, QA test additions, evidence report and lead disposition. Record superseded runs as such; do not present an old green result as current.
5. Track merged/closed state only with observed evidence. This ledger does not authorize merging, deleting branches, pruning worktrees or deploying.

## Test run history

| Run | Product revision | Environment | Result | Report |
| --- | --- | --- | --- | --- |
| BASELINE-20260908 | `409d82415f17cfe899267bd981c317067a798d59` | Windows, Node 21.7.1, npm 10.5.0, preexisting dependencies | Build passed; unsupported Node warning; no automated behavior suite exists | [Baseline audit](reports/2026-09-08-baseline-audit.md) |

Append S001 developer, independent QA and retest rows with actual results. Do not prefill passes for planned work.
