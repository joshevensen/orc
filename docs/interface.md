# Orc — Interface

This document says **how Orc's web app is laid out and behaves**. What it must do is in [requirements.md](requirements.md) (mainly FR-6, FR-56, FR-89 to FR-92); why the web app is the main interface is in [ADR 0025](decisions/0025-web-app-is-the-workspace.md). Visual design (look, spacing, colour) is done separately; this document covers structure and behaviour.

## 1. Principles

- **Tasks, not sessions.** Every screen hangs off a task (a work item), so conversations, runs, reviews, and costs trace back to real work.
- **Asynchronous.** People don't steer a run while it works. They act at checkpoints: answering questions, reviewing, approving.
- **The issue tracker is the record.** The task page looks like an issue page, but edits to an item's description go to the tracker as proposed edits, not into a second copy. Comments made in Orc are posted to the tracker.
- **Explicit actions only.** Writing a comment never starts or continues a run on its own (FR-8). Runs start, continue, and stop through buttons.
- **Everything through the API.** The web app has no backend of its own and can do nothing the API can't (FR-54).

## 2. Layout

Three columns. The side columns can be collapsed; the middle column can't.

```
┌──────────────┬───────────────────────────────┬────────────────────────┐
│ Navigation   │ Task                          │ Work product           │
│              │                               │ [Changes|Evidence|Run] │
│ + New task   │ Title          Status ▾       │                        │
│ Search       │ Spec, criteria, links         │ file.ts ▾  1 / 7  ‹ ›  │
│              │ Activity feed                 │                        │
│ Needs you    │   comments, questions,        │   diff of one file     │
│ Running      │   run events                  │                        │
│ For review   │                               │                        │
│ Done         │ ┌───────────────────────────┐ │                        │
│              │ │ Control panel (fixed)     │ │                        │
│ Insights …   │ │ comment box  + actions    │ │                        │
└──────────────┴─┴───────────────────────────┴─┴────────────────────────┘
```

- **Collapsing.** Each side column has a collapse toggle; the choice is remembered per person.
- **Review mode.** For reviewing a change, one action collapses the navigation and widens the work-product column, keeping the task's comments visible. The work-product column can also expand to full width.
- **Desktop first.** On narrow screens the side columns become drawers.

## 3. Navigation (left)

- **New task** (FR-89): choose the repo or repos, describe the work, optionally attach designs. Orc creates the matching item in the issue tracker.
- **Search** across tasks.
- **Tasks grouped by state**:
  - **Needs you:** a question from Orc, an approval, or a change ready for your review.
  - **Queued or running:** with queue position when waiting for capacity (FR-49).
  - **Ready for review:** developed changes waiting for anyone's review.
  - **Done:** shipped, merged, or closed. Older items are paged.
- Tasks from the issue tracker (created by project managers) appear alongside tasks created in Orc.
- **Below the task list:** Insights, Learning, Settings (§7), shown according to access level.

## 4. Task page (middle)

Modelled on an issue page: content on top, activity below, and a fixed control panel at the bottom.

**Header**
- Title, tracker key and link, status, the workflow and step it's in, assignee or requester, repos.
- Links: tracker item, branch, pull request (once opened), designs.

**Body**
- **Description** from the tracker, read-only in Orc. Proposed edits from Spec (FR-14) appear as a suggested change the person accepts, edits, or rejects; accepting writes it to the tracker.
- **Specification and acceptance criteria.** Each criterion shows its verification evidence (test, output, or screenshot), or says plainly that it couldn't be verified (FR-15). Selecting a criterion opens its evidence in the right column.

**Activity feed**
- One chronological feed: people's comments, tracker comments, Orc's messages and questions, and run events (started, waiting, finished, failed, cost so far).
- Comments posted in Orc are also posted to the tracker, attributed to the person, and tracker comments appear in the feed (FR-92).
- Talking with Orc about a run (FR-77) happens here; Orc answers from the run's record and changes nothing while answering.

### Control panel

Fixed to the bottom of the middle column, like a chat composer, and always visible.

- **Comment box.** Posts a comment to the task (and the tracker). It never starts a run on its own.
- **Action buttons** for the task's current state (§6). Only the actions the person's role and access allow are shown.
- **Request changes** turns the comment into a change request: Orc restates what it will do and which workflow it will use, and starts the follow-up run once the person confirms (FR-78).

## 5. Work product (right)

Three tabs.

### Changes

- **One file per page.** A dropdown lists the changed files; next and previous buttons and keyboard shortcuts move between them.
- The dropdown shows, for each file, whether this person has marked it **reviewed** and how many comments it has. Source files come first; generated and lock files are listed last and collapsed.
- **Line comments** on the diff. Comments are part of the review (FR-90) and a source for learning (FR-67).
- **Manual edits** (Engineers only, on repos they can work on, FR-91):
  - An Engineer can edit the file directly in the diff view.
  - Saving creates a commit on the run's branch, authored by that person, made through the Action service (which still runs the secret scan, FR-85). Orc builds on people's commits and never rewrites them (FR-87).
  - After a manual edit, the evidence and checks are marked **out of date**. Orc re-runs them only when someone asks (the **Re-run checks** action). Approval is blocked while checks are out of date.
  - Manual edits are recorded as corrections and are a strong learning signal (FR-67).
- Editor and diff component: CodeMirror 6 with its merge view (`@codemirror/merge`), which shows the diff and allows editing in one component. To be added to the approved packages when the screen is built (ADR 0021).

### Evidence

Screenshots, test output, and recordings per acceptance criterion; a design comparison when designs are attached (FR-56). Live previews of the running app are [later] (FR-90).

### Run

The run's steps, where it stopped and why, cost, lessons applied (FR-71), and links to earlier runs on the task.

## 6. Task states and actions

The control panel shows the actions for the current state.

| State | Shown in navigation as | Main actions |
|---|---|---|
| New (no run yet) | Needs you, for its creator | **Start** (choose the workflow), comment |
| Waiting for input | Needs you | **Answer and continue**, comment, cancel |
| Waiting for approval (FR-20) | Needs you | **Approve**, **Send back with feedback**, **Reject** |
| Queued | Queued or running | Cancel |
| Running | Queued or running | Cancel |
| Ready for review | Ready for review; Needs you for its requester | **Approve**, **Request changes**, **Re-run checks** (if out of date), comment |
| Approved, shipping | Queued or running | — |
| Pull request open | Done (watched, FR-86) | Comment; reviewers act on GitHub |
| Done | Done | **Follow-up** (FR-78), comment |

- **Approve** in review lets Ship open the pull request (FR-16, FR-90). It is disabled while checks are out of date.
- The emergency pause (FR-83) is in Settings and, for Admins, in the header of every page.

## 7. Other pages

- **Insights:** usage, cost, and quality trends by workflow, team, repo, and over time; skill performance and version comparisons (FR-50, FR-56).
- **Learning:** proposed and active lessons, approvals, and conflicts (FR-68, FR-72).
- **Settings,** by access level: organization, teams and roles, repos and onboarding (FR-3), products (FR-2), policy and approvals (FR-20), spending caps (FR-48), sandbox slots and warm pool (ADR 0024), integrations, and the pause switch (FR-83).

## 8. Open questions ⚠️

- **Live updates:** refresh by polling through TanStack Query, or have the API push run updates (server-sent events)?
- **What's in v1:** all of §7 at launch, or tasks and settings first, with Insights and Learning after?
- **Notifications in the app:** a bell and unread counts, or rely on "Needs you" plus email?
