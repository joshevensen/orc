# Orc — Interface

This document says **how Orc's web app is laid out and behaves**. What it must do is in [requirements.md](requirements.md) (mainly FR-6, FR-56, FR-77, FR-89 to FR-92); why the web app is the main interface is in [ADR 0025](decisions/0025-web-app-is-the-workspace.md), and why tasks are single-repo with run records instead of conversation is in [ADR 0026](decisions/0026-one-repo-per-task-and-run-records.md). Visual design (look, spacing, colour) is done separately; this document covers structure and behaviour.

## 1. Principles

- **Tasks, not sessions.** Every screen hangs off a task (a work item in one repo), so comments, runs, reviews, and costs trace back to real work.
- **Asynchronous.** People don't steer a run while it works. They act at checkpoints: answering questions, reviewing, approving.
- **The issue tracker is the record.** The task page looks like an issue page, but edits to an item's description go to the tracker as proposed edits, not into a second copy. Comments made in Orc are posted to the tracker. Mentions are left to the tracker.
- **Explicit actions only.** Writing a comment never starts or continues a run on its own (FR-8). Runs start, continue, and stop through buttons.
- **Show the record, don't narrate it.** Why Orc did something is answered by the run record (FR-77), not by asking a model.
- **Right detail for the role.** Engineers see code and run detail; other roles see plain-language summaries and evidence (FR-51).
- **Everything through the API.** The web app has no backend of its own and can do nothing the API can't (FR-54).

## 2. Layout

Three columns. The side columns can be collapsed; the middle column can't.

```
┌──────────────┬───────────────────────────────┬────────────────────────┐
│ Navigation   │ Task                          │ Work product           │
│              │                               │ [Output|Evidence|      │
│ + New task   │ Title          Status ▾       │  History]              │
│ Search       │ Spec, criteria, links         │                        │
│              │ Activity feed                 │ file.ts ▾  1 / 7  ‹ ›  │
│ Needs you    │   comments, Orc's messages,   │                        │
│ Running      │   run events                  │   diff of one file     │
│ For review   │                               │                        │
│ Done         │ ┌───────────────────────────┐ │                        │
│              │ │ Control panel (fixed)     │ │                        │
│ Insights …   │ │ comment box  + actions    │ │                        │
└──────────────┴─┴───────────────────────────┴─┴────────────────────────┘
```

- **Collapsing.** Each side column has a collapse toggle; the choice is remembered per person.
- **Review mode.** For reviewing, one action collapses the navigation and widens the work-product column, keeping the task's comments visible. The work-product column can also expand to full width.
- **System banners.** Across the top of every affected page: Orc is paused for the organization, a workflow, or a repo (FR-83); a spending cap has been reached (FR-48); an integration is disconnected.
- **Desktop first.** On narrow screens the side columns become drawers.

## 3. Navigation (left)

- **New task** (FR-89):
  - Choose **one repo** (FR-30). Work that needs another repo becomes a linked task.
  - Tracker details: for Jira, the project and issue type; for GitHub Issues, the issue is created in the task's repo unless the organization has set a different issues repo.
  - Describe the work and optionally attach designs.
  - Optionally choose the first workflow to start; otherwise the task is created without a run.
  - Orc creates the matching item in the issue tracker.
- **Search** across tasks.
- **Tasks grouped by state** (§7):
  - **Needs you:** a question from Orc, an approval, a change ready for your review, or a pull request needing a revision.
  - **Queued or running:** with queue position when waiting for capacity (FR-49).
  - **Ready for review:** work waiting for anyone's review.
  - **Done:** shipped, merged, or closed. Older items are paged.
- Tasks from the issue tracker (created by project managers) appear alongside tasks created in Orc.
- **Below the task list:** Insights, Learning, Settings (§8), shown according to access level.

## 4. Task page (middle)

Modelled on an issue page: content on top, activity below, and a fixed control panel at the bottom.

**Header**
- Title, tracker key and link, status, the workflow and step it's in, assignee or requester, the repo.
- Links: tracker item, branch, pull request (once opened), designs, and linked tasks (FR-32).

**Body**
- **Description** from the tracker, read-only in Orc. Spec's proposed edits are reviewed in the Output tab (§5).
- **Specification and acceptance criteria.** Each criterion shows its verification evidence (test, output, or screenshot), or says plainly that it couldn't be verified (FR-15). Selecting a criterion opens its evidence in the right column.

**Activity feed**
- One chronological feed: people's comments, tracker comments, Orc's messages and questions with their replies, and run events (started, waiting, finished, failed, cost so far).
- Comments posted in Orc are also posted to the tracker, attributed to the person, and tracker comments appear in the feed (FR-92).
- No mentions: `@name` in an Orc comment is posted as plain text. To notify someone, mention them in the tracker. Orc's own messages reach people through notifications (FR-79, FR-80).

### Control panel

Fixed to the bottom of the middle column, like a chat composer, and always visible.

- **Comment box.** Posts a comment to the task and the tracker. It never starts a run on its own.
- **Action buttons** for the task's current state (§7). Only the actions the person's role and access allow are shown.
- **Request changes** turns the comment into a change request: Orc restates what it will do and which workflow it will use, and starts the follow-up run once the person confirms (FR-78).

## 5. Work product (right)

Three tabs: **Output**, **Evidence**, and **History**. The Output tab adapts to what the task's latest workflow produced.

### Output

| Workflow | Output tab shows | Review actions |
|---|---|---|
| **Spec** | The proposed edits to the item's description, as a before-and-after view | Accept (writes to the tracker), edit, or reject (FR-14) |
| **Develop** | The code change (below) | Change review: approve or request changes (FR-90) |
| **Ship** | The pull request: status, CI, and reviewer activity from GitHub | Revise when CI fails or a reviewer asks for changes (FR-16, FR-86) |
| **Investigate** | The finding: confirmed root cause (or what's still unknown), whether it was reproduced, the recommended next step, and which repos were examined (FR-17, FR-32) | **Accept finding**, **Escalate to engineering**, **Ask a follow-up** (below) |
| **Document** | The draft, rendered, with a diff against the previous draft | Comment, request changes, or approve; approval hands the draft on but Orc never publishes (below, FR-18) |

**Investigate findings** (FR-17). The actions follow the kind of finding:

| Finding | Action | What happens |
|---|---|---|
| Root cause found, needs code | **Accept finding** | The finding and its proposed fix are written to the tracker item. The task returns to New with **Start Develop** available; accepting never starts Develop itself (FR-19). |
| Root cause found, no code needed (already fixed, or a manual action) | **Accept finding** | The finding is posted to the tracker and the task is marked Done. |
| Questions for the reporter | (automatic) | Orc posts the questions to the tracker item and the task waits for input. |
| Orc couldn't get far enough | **Escalate to engineering** | The task is assigned to an Engineer or the repo's team, appears under their Needs you, and a tracker comment says why. |

On any finding, **Ask a follow-up** works like Request changes: Orc restates what it will investigate next and runs only once the person confirms (FR-78). There's no separate reject; disagreeing is a follow-up.

**Document drafts** (FR-18). Where an approved draft goes depends on where the documentation lives:
- **In the task's repo** (a README, a `docs/` folder): the draft becomes a change in the repo and goes through change review and Ship like code. A person merges it.
- **Anywhere else** (help center, knowledge base): the approved draft is attached to the tracker item and can be downloaded as Markdown. A person publishes it.
- Publishing to external documentation tools is [later], behind a new integration contract.

**Code changes** (Develop):
- **One file per page.** A dropdown lists the changed files; next and previous buttons and keyboard shortcuts move between them. When the change is a stack of pull requests, a stack selector sits above the file dropdown.
- The dropdown shows, for each file, whether this person has marked it **reviewed** and how many comments it has. Source files come first; generated and lock files are listed last and collapsed.
- **Line comments** on the diff, called change-review comments (FR-90). They're part of the change review and a source for learning (FR-67).
- **Manual edits** (Engineers only, on repos they can work on, FR-91):
  - An Engineer can edit the file directly in the diff view.
  - Saving creates a commit on the task's branch, authored by that person, made through the Action service (which still runs the secret scan, FR-85). Orc builds on people's commits and never rewrites them (FR-87).
  - After a manual edit, the evidence and checks are marked **out of date**. Orc re-runs them only when someone asks (**Re-run checks**). Approval is blocked while checks are out of date.
  - Manual edits are recorded as corrections and are a strong learning signal (FR-67).
- Editor and diff component: CodeMirror 6 with its merge view (`@codemirror/merge`), which shows the diff and allows editing in one component. To be added to the approved packages when the screen is built (ADR 0021).

### Evidence

Screenshots, test output, and recordings per acceptance criterion; a design comparison when designs are attached (FR-56). Live previews of the running app are [later] (FR-90).

### History

The run record (FR-77), across every run on the task:
- Each step with its **decision records**: what was decided, the reason, what was checked, and which lessons were used (FR-71).
- Where each run stopped and why, actions requested and their outcome, cost, and duration.
- Search and filters: by run, step, kind of entry (decision, check, action, lesson), and outcome.

## 6. Views by role

What the task page shows by default depends on the person's roles (FR-51); anyone can switch to the full view if their access allows.

| Role | Default view |
|---|---|
| **Engineer** | Everything: code changes with manual edits, full History |
| **Designer** | Evidence and design comparison first; code changes hidden by default |
| **Support** | Investigate findings in plain language, evidence; code and History detail hidden by default |
| **Product** | Spec and acceptance criteria, evidence, plain-language summaries; code hidden by default |

## 7. Task states and actions

The control panel shows the actions for the current state.

| State | Shown in navigation as | Main actions |
|---|---|---|
| New (no run yet) | Needs you, for its creator | **Start** (choose the workflow), comment |
| Waiting for input | Needs you | **Answer and continue**, comment, **Take over**, cancel |
| Waiting for approval (FR-20) | Needs you | **Approve**, **Send back with feedback**, **Reject** |
| Queued | Queued or running | Cancel |
| Running | Queued or running | **Take over**, cancel |
| Ready for review | Ready for review; Needs you for its requester | **Approve**, **Request changes**, **Re-run checks** (if out of date), comment |
| Approved, shipping (Ship run) | Queued or running | Cancel |
| Taken over | Needs you, for the person who took over | **Hand back**, comment |
| Pull request open | Done (watched, FR-86) | Comment; reviewers act on GitHub |
| Pull request needs revision | Needs you | **Revise**, comment |
| Done | Done | **Follow-up** (FR-78), comment |

- No run is in progress while a task is ready for review (FR-7). **Approve** starts Ship, which opens the pull request (FR-16, FR-19, FR-90); it is disabled while checks are out of date. **Re-run checks** starts a short run that only re-runs checks and evidence.
- **Request changes**, **Revise**, and **Follow-up** go through FR-78: Orc restates the work and starts a new run only once the person confirms.
- **Take over** (Engineers, FR-11) stops the run and leaves the branch for the person. **Hand back** (FR-87) lets Orc continue from the branch's current head, including the person's commits; Orc first says what it understood their changes to do.
- The emergency pause (FR-83) is in Settings and, for Admins, in the header of every page.

## 8. Other pages

- **First-time setup** (FR-1, FR-3): shown to Admins until done. Connect GitHub (the GitHub App), the issue tracker, the identity provider, email, and the LLM provider (plus Bedrock for embeddings when the provider is the Anthropic API, ADR 0023); then onboard repos, where Orc works out and verifies each repo's build-and-check settings.
- **Insights:** usage, cost, and quality trends by workflow, team, repo, and over time; skill performance and version comparisons (FR-50, FR-56).
- **Learning:** proposed and active lessons, approvals, and conflicts (FR-68, FR-72).
- **Settings,** by access level: organization, teams and roles, repos and onboarding (FR-3), products (FR-2), policy and approvals (FR-20), spending caps (FR-48), sandbox slots and warm pool (ADR 0024), integrations, the pause switch (FR-83), and the **audit log** (Q-AUD-1): every action record, approval, policy change, pause, and restore, filterable and exportable.

## 9. Open questions ⚠️

- **Live updates:** refresh by polling through TanStack Query, or have the API push run updates (server-sent events)?
- **What's in v1:** all of §8 at launch, or setup, tasks, and settings first, with Insights and Learning after?
- **Notifications in the app:** a bell and unread counts, or rely on "Needs you" plus email?
