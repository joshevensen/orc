# 0028 — Review is a walkthrough; pull request review happens in Orc

**Status:** Accepted · **Date:** 2026-10-06

## Context
The goal is for designers and product people to complete half of the organization's simpler tickets. They can't judge code, so a change review built like GitHub's file list is a rubber stamp for them. SOC2 already requires that an engineer who didn't write the change approves it before production, and that engineer usually lacks the context the assignee had and is the bottleneck when non-engineers ship more work.

## Decision
- **Review is acceptance, shown as a walkthrough.** Orc presents what it did and why, and proves each acceptance criterion: before-and-after screenshots with desktop and mobile views, the design next to the build when designs are attached, the test that covers it, a link to the organization's preview environment where one exists, the states it checked (empty, loading, error, mobile, long text), decisions with rejected alternatives, and what it's unsure about. The person accepts each step or requests a change on it; requests are sent together as one follow-up (FR-78) and can be saved as lessons.
- **Two versions by role.** Engineers see each step's code inline, plus a Code view with the changed files, Orc's importance marks, and line notes. Designers and Product see no code.
- **Code review is a separate, engineer-only step on the pull request.** Every pull request needs approval from one engineer who isn't the assignee. One approval is always enough; the people involved raise anything more.
- **Pull request reviews are team tasks.** Each one is open to the team rather than assigned, and anyone eligible claims it. The assignee and non-engineers can't claim or approve.
- **The review screen is built for reviewers without context:** a brief (why, agreed criteria, what's out of scope, what was already checked and by whom, what the reviewer's job is), a tour ordered by risk where high-risk stops must be reviewed before approving, "how this could break" for each stop with each case marked covered (by which test) or untested, blast radius, and comments tagged blocking, suggestion, or question. Re-reviews show only what changed.
- **Approval is posted to GitHub as the reviewer.** The SOC2 record stays on GitHub. Requesting changes turns the comments into proposals in the assignee's Feedback queue.

## Alternatives considered
- **Keep review as a diff for everyone.** Rejected: non-engineers can't use it, and it duplicates GitHub.
- **Let non-engineers approve low-risk pull requests.** Rejected: SOC2 requires an engineer who didn't write the change.
- **Assign reviewers automatically.** Rejected: claiming spreads load and avoids waiting on one person; `CODEOWNERS` still decides who is eligible.
- **Require two approvals for high-risk changes.** Rejected: one is enough; reviewers ask for more when they need it.

## Consequences
- Develop must capture screenshots across viewports and states, compare with designs, and write the walkthrough's decisions and uncertainty into the run record.
- Approvals must be submitted with the reviewer's own GitHub user authorization, not Orc's app identity, or GitHub won't count them as a person's review. This is a new path through the Action service.
- Orc posts a reviewer-oriented summary on each pull request (FR-59) and needs risk classification per change.
