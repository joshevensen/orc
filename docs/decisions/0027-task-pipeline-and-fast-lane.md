# 0027 — The task pipeline, fast lane, and tripwires

**Status:** Accepted · **Date:** 2026-10-06

## Context
The web app needs one way to show where a task is and what happens next, for engineers and for designers and product people who now make simple changes themselves. Workflows (Spec, Develop, Ship, Investigate, Document) are how Orc runs work; people think in steps: is the spec done, is there a plan, is it built, did I check it, is it out for review. Small tasks also need a lighter path, or engineers go around Orc for one-line fixes.

## Decision
- **Six stages for a Develop task:** Spec, Analyze, Build, Review, Ship, Feedback. Analyze is Develop's check that the work is within what Orc does reliably, ending in an approved plan or a decline (FR-15, FR-20). Review is the change review (FR-90). Feedback is Ship watching the pull request until it merges (FR-16, FR-86); the task ends at merge. Investigate and Document tasks show their own, shorter pipelines.
- **The pipeline is navigation.** A done stage can be selected to go back to it. Going back resets the code to that stage's checkpoint, keeps the current code on a backup branch, clears verifications and check-offs, and closes the pull request when there is one; a new one opens at Ship. A confirmation lists what resets and what can't be undone outside Orc, and Undo is available until the task moves forward.
- **Fast lane.** Orc proposes the fast lane at intake for small, low-risk tasks, and the assignee confirms or overrides it. It skips the separate plan approval in Analyze, unless Admin policy requires that approval (FR-20, FR-27). Change review and the engineer's pull request review always happen.
- **Qualifying signals:** an estimate of about 3 files and 50 lines or fewer, no protected paths, 3 or fewer testable criteria, tests covering the area, and a clean track record for similar tasks in the repo.
- **Code owners own the thresholds.** Each repo's protected paths and fast-lane thresholds are set by its code owners (from `CODEOWNERS`, editable in Orc), not by the task's assignee.
- **Tripwires** stop a fast-lane run and say which fired: the change outgrows its estimate, touches a protected path, fails tests twice, needs a new dependency or schema change, or meets ambiguity in the spec. The person chooses: move to the full lane (keeping the draft), narrow the scope (Orc proposes a smaller task and splits off the rest), continue anyway (Engineers only; recorded, and the path's code owners join the review), or hand to an engineer (Designers and Product).
- **Learning applies to routing.** A fast-lane task that's reverted or reopened tightens that repo's thresholds.

## Alternatives considered
- **Show workflows, not stages.** Rejected: "Develop" hides the two decisions people care about (approve the plan, accept the result).
- **Let the assignee decide fast lane alone.** Rejected: the risk sits with code owners and reviewers, so they set the limits.
- **Silently escalate a fast-lane run to the full lane.** Rejected: the person should choose, since narrowing the scope is often better.

## Consequences
- Develop needs counters and checks for the tripwires (diff size against the estimate, protected paths, repeated test failures), alongside FR-13's limits.
- Repo onboarding (FR-3) reads `CODEOWNERS` for protected paths and lets code owners edit thresholds.
- Going back needs checkpoints per stage and pull request closing through the Action service.
