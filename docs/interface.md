# Orc — Interface

This document says **how Orc's web app is laid out and behaves**. What it must do is in [requirements.md](requirements.md) (mainly FR-6, FR-56, FR-77, FR-89 to FR-109). The decisions behind it are in the ADRs: the web app as the workspace ([0025](decisions/0025-web-app-is-the-workspace.md)), single-repo tasks and run records ([0026](decisions/0026-one-repo-per-task-and-run-records.md)), the pipeline and fast lane ([0027](decisions/0027-task-pipeline-and-fast-lane.md)), the review walkthrough and pull request review ([0028](decisions/0028-review-walkthrough-and-pr-review-in-orc.md)), engineers working in Orc ([0029](decisions/0029-engineers-work-in-orc.md)), and editing and archiving through the tracker ([0030](decisions/0030-editing-and-archiving-through-the-tracker.md)). The visual design, with screens for every stage, is in [design/](design/README.md).

## 1. Principles

- **Tasks, not sessions.** Every screen hangs off a task (a work item in one repo), so comments, runs, reviews, and costs trace back to real work.
- **Explicit actions only.** Writing a comment never starts or continues a run on its own (FR-8). Runs start, continue, stop, and are steered through buttons.
- **Work happens in Orc.** Engineers start every task here and leave only to debug; designers and product people complete simple changes without code (0029, 0028).
- **The issue tracker is the record.** Project managers plan there. Orc reads items, and writes back status, comments, and edits people make in Orc (FR-99).
- **Prove it, don't describe it.** Orc shows evidence for each acceptance criterion: screenshots, test results, output. Reviewers judge results, not explanations (FR-15).
- **Show the record, don't narrate it.** Why Orc did something is answered by the run record (FR-77), not by asking a model.
- **Right detail for the role.** Engineers see code and run detail; other roles see plain-language summaries and evidence (FR-51).
- **One thing asks for attention.** The current stage and the next action are the loudest things on screen, and the action bar has one primary button. Moss (the accent colour) means interactive or active; static things are neutral.
- **Everything through the API.** The web app has no backend of its own and can do nothing the API can't (FR-54).

## 2. Layout

Every page shares a header. The task page has a pipeline under it and three columns.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ ORC (home)   ‹ [ WEB-482 · 5 need you  ▾ ] ›   /New task/   Ask ⌘K  (JE)   │
│              [ Task title              ]                                  │
├───────────────────────────────────────────────────────────────────────────┤
│  SPEC  ›  ANALYZE  ›  BUILD  ›  REVIEW  ›  SHIP  ›  FEEDBACK               │
├───────────────┬─────────────────────────────────────┬─────────────────────┤
│ Details  Edit │ [Stage screen]          (open)      │ Criteria  3/4  Edit │
│ Problem  Edit │                                     │  ✓ criterion        │
│ Scope    Edit │                                     │  ✓ criterion        │
│ Notes    Edit │                                     │  ? verify by hand   │
│               │ [Code]                  (closed)    │                     │
│ (scrolls)     │ [Terminal]              (closed)    ├─────────────────────┤
│               │ [Log]                   (closed)    │ Next action         │
│               │                                     │ hint · [Primary]    │
└───────────────┴─────────────────────────────────────┴─────────────────────┘
```

**Header**
- **ORC logo** goes to Home (§3).
- **Task switcher:** the task's key, how many tasks need you, and its title. Selecting it opens the task list (§4). The previous and next buttons beside it move between tasks that need you, not through every task.
- **New task** (FR-89), **Ask** (FR-105, §10), and **⌘K**, the command palette (FR-109, §10).
- **Avatar menu:** name and role, Settings, Profile, Account, Log out.

**Pipeline.** The task's stages (§5). Each stage reads done, current, not started, or skipped.

**Left column: task info.** Details, Problem, Scope, and Notes, always open, scrolling as one column. Each has an Edit button (§7). Details holds the repo, requester, assignee, the tracker item, links (branch, designs, pull request), the lane, the sandbox (Engineers), and a run summary: check runs, review rounds, spend, and run time so far. Scope has two parts, In scope and Out of scope.

**Middle column: the work.** An accordion, so the open section gets the full height: the current stage's screen, **Code** (Engineers, §6), **Terminal** (Engineers, FR-104, §10), and **Log** (the run record and comments, §8). Opening one closes the others. The stage's screen is open by default.

**Right column: criteria and the next action.** Acceptance criteria scroll inside their panel, each with its status and evidence. The **action bar** is pinned to the bottom-right corner: one line of guidance and the buttons for this state, primary first.

**Status strips** appear under the pipeline when something just happened that can be undone: an edit, an archive, going back a stage, taking over.

**System banners** across the top of every affected page: Orc is paused for the organization, a workflow, or a repo (FR-83); a spending cap has been reached (FR-48); an integration is disconnected.

**Desktop first.** On narrow screens the side columns become drawers.

## 3. Home

The starting point (FR-102), reached from the logo. One page for "what's going on with my work". A task appears in every list it belongs to; each list answers a different question.

- **Count buttons** across the top, one per list, each jumping to its list.
- **Agents running:** every active run the person started, with the agent, current step, time, cost, and last action. A run waiting on the person is flagged. Each row has Open and Pause; Engineers also get Take over. Shows how many run slots the team is using (FR-49).
- **Needs you** (the main list): questions, approvals, tripwires, failed checks, and feedback to decide.
- **Ready for your review:** changes and findings Orc finished.
- **Due soon:** tasks with a due date in the next 7 days. Due dates come from the tracker and are optional; tasks without one don't appear here.
- **To do:** tasks with no run yet.
- **Gone quiet** (FR-101): tasks with no activity for 30 days. **Keep** posts "<name> decided to keep this task open" to the task and the tracker, which restarts the 30 days. **Archive** asks for a reason (§11).
- **PR reviews** (Engineers): pull request review tasks waiting for a reviewer (FR-97, §9).
- **Waiting on others:** tasks blocked on someone else. For Designers and Product this is **Waiting on engineer review**, showing where their changes sit until an engineer approves the code.
- **Recently done:** merged or closed in the last 7 days.

## 4. Task list

The quick switcher, opened from the task switcher or the command palette: what needs attention now, from any screen. It's a modal with search and a Close button, scrolling when needed. Groups: Needs you, Queued or running, Ready for review, Done, PR reviews open to your team (Engineers), and Archived (with Restore).

## 5. Pipeline and stages

Each workflow (FR-14 to FR-18) shows as stages in the pipeline (0027). A Develop task's journey:

| Stage | Workflow | What happens | Main actions |
|---|---|---|---|
| **Spec** | Spec (FR-14) | Orc asks questions and proposes the missing detail: problem, scope, acceptance criteria | Reply, **Approve spec** |
| **Analyze** | Develop, before code (FR-15, FR-20) | Orc judges whether the work is within what it does reliably and proposes a plan | **Approve plan**, **Send back**, **Reject** |
| **Build** | Develop (FR-15) | Orc writes, reviews, and verifies the change | **Answer and continue**, **Take over**, **Cancel run** |
| **Review** | Change review (FR-90) | The assignee accepts the change against the spec (§6) | **Approve** (starts Ship), **Request changes** |
| **Ship** | Ship (FR-16) | Orc opens the pull request and requests a reviewer | **Revise** if CI fails |
| **Feedback** | Ship, watching (FR-16, FR-86, FR-98) | Orc handles review comments until merge (§6); the task ends at merge | Decide each proposal, **Build approved**, **Push and reply** |

Investigate tasks show Spec (optional), Investigate, and Finding; their actions are **Accept finding**, **Escalate to engineering**, and **Ask a follow-up** (FR-17). Document tasks show Spec, Draft, and Review, then Ship when the docs live in the repo (FR-18).

**Stage states.** Done stages are outlined with a check. The current stage is solid: moss normally, orange when Orc is blocked (a question, a tripwire), red on an error. The current stage has no icon; its text is enough. Skipped stages are striped.

**Going back** (FR-95). Selecting a done stage goes back to it, after a confirmation that lists what resets (code since that stage, criteria verifications, file check-offs) and what can't be undone outside Orc (comments already posted). Code is kept on a backup branch. Going back from Ship or Feedback closes the pull request; a new one opens when the task reaches Ship again. A strip offers **Undo** until the task moves forward again.

**Fast lane** (FR-93, FR-94). For small, low-risk tasks, Orc proposes the fast lane at intake and the assignee confirms or overrides. The label shows in Details with Orc's reason. It skips the separate plan approval in Analyze, unless an Admin's approval policy requires it (FR-20, FR-27). Change review and the engineer's PR review still happen.
- **Qualifies:** an estimate of about 3 files and 50 lines or fewer; no protected paths; 3 or fewer testable criteria; tests cover the area; similar tasks in the repo went through without rework. Code owners keep each repo's protected paths and thresholds.
- **Tripwires** stop a fast-lane run and say which one fired: the change outgrows its estimate, touches a protected path, fails tests twice, needs a new dependency or schema change, or hits ambiguity in the spec. The choices: **Move to the full lane** (to Analyze, keeping the draft), **Narrow the scope** (Orc proposes a smaller task and splits off the rest), **Continue anyway** (Engineers only, recorded, and the protected path's code owners join the review), or **Hand to an engineer** (Designer and Product).
- A fast-lane task that's reverted or reopened tightens that repo's thresholds.

## 6. The middle column by stage

**Spec.** Orc's questions and people's replies, then **Approve spec**. Replying to Orc's question is the explicit action that continues the run (FR-8). A spec is complete when it has a problem, what's in scope, what's out of scope, and acceptance criteria that can each be checked; notes are optional. Missing sections show **Missing** in the left column.

**Analyze.** Orc's finding or plan: a heading, a summary, the steps, and any approval requirement from policy (FR-20). An optional feedback box; required to send the plan back.

**Build.** The run's steps with their state. When Orc asks a question, the question and an answer box appear here. When CI fails, Engineers see the failing step and log lines pulled from the CI job; Designer and Product see a plain-language note and **Ask an engineer**. A fast-lane tripwire shows here with its choices.

**Review (change review, FR-90, FR-96).** A **walkthrough**, not a copy of GitHub's file list:
- **What I did:** two or three sentences, and **Open preview** when the repo has a preview environment.
- **One step per acceptance criterion:** what changed and why, the proof (before and after screenshots with desktop and mobile views; the design next to the build when designs are attached; the test that covers it), and **Looks right**. Criteria Orc couldn't verify say so and give the person steps to check it themselves (FR-15).
- **States Orc checked:** empty, loading, error, mobile, long text.
- **Decisions I made**, each with the alternative Orc rejected.
- **What I'm unsure about.**
- Any step can get **Request a change**, optionally saved as a lesson for the repo (FR-41, FR-81). Requests are sent together as one follow-up (FR-78).
- **Approve** unlocks when every step is accepted and every criterion is verified.
- **Engineers** see each step's code inline, with **Edit** and **Open in Code**. The **Code** section is the traditional view: the changed files grouped by folder, Orc's importance marks (scrutinize, quick scan), and a diff with Orc's notes on the lines they're about (FR-60, FR-61).
- **Manual edits** (Engineers, FR-91): editing a snippet or a diff commits as that person through the Action service (FR-85). Checks and evidence re-run automatically, and the change can't be approved until they pass.

**Ship.** The pull request's status and checks.

**Feedback** (FR-98). Every review comment, tracker comment, and AI-review comment on the pull request becomes a row with Orc's proposal (change and reply, reply only, or no action). The person decides each one in a modal, one at a time. Comments needing no action are collapsed with Orc's reason. **Build approved** makes the approved changes in one run; the person then reviews only what changed since their last review; **Push and reply** pushes and posts the replies. When main moves and conflicts with the change, a banner offers **Resolve** (FR-108): main's version, this branch's, and Orc's merge side by side, with **Use Orc's merge**, **Edit the merge**, or keep either side (FR-86). Designer and Product see that Orc merged it and an engineer confirms it in code review.

## 7. Editing the task

Each left-column section and the criteria have an **Edit** button (FR-99, 0030). The edit modal shows the fields, an **Or ask Orc to change it** box, and one line saying what saving will do. Saving writes to the tracker item as the person; every edit is in the Log with who made it, and a strip offers **Undo**.

- **Details:** only the assignee can be edited, at any stage. Repo, requester, and links come from the tracker and GitHub.
- **Problem and Scope:** editable at any stage. After Build has started, saving goes back to Analyze, through the going-back confirmation.
- **Notes:** editable any time; never changes the stage.
- **Criteria:** editable in Spec and Analyze, one per line. Unchanged criteria keep their results. After Analyze they're locked; go back to change them.
- **Ask Orc to change it** applies Orc's edit directly, recorded and undoable like a manual one. When the edit needs to go back a stage, it waits for that confirmation.
- Running tasks can't change Problem or Scope until the run pauses.

## 8. Log

The run record (FR-77) and the task's comments in one feed, with filters: All, Comments, Orc messages, Run record, and, for Engineers, **Agent transcript** (FR-107: every file the agent read, search, command, test run, and edit). Steering messages appear here too. Decision records show the decision, the reason, what was checked, and which lessons were used (FR-71). A comment box at the bottom posts to the task and the tracker (FR-92).

## 9. PR review (Engineers)

Every pull request Orc opens needs approval from one engineer who isn't the assignee (SOC2, C-6); one approval is always enough. Orc turns each one into a **pull request review task** (FR-97, 0028): it isn't assigned, and any eligible engineer can claim it, except the one whose task produced it.

- **Queue:** claimed by you, open to the team (with **Claim**), claimed by others, and "You can't review", with the reason.
- **Left column, context for someone who wasn't there:**
  - **Brief:** why the change exists, the agreed criteria and who verified each, what's out of scope.
  - **Already checked:** the assignee's acceptance in Review, CI, and Orc's self-review.
  - **Your job here:** correctness, security, data integrity, maintainability; not copy and layout.
- **Middle: a tour, riskiest first.** High-risk stops (money, auth, data, concurrency) must be reviewed before approving; medium-risk stops are optional; low-risk files are grouped into one skim check. Each stop has the code, what it does, and **How this could break**: each case marked Covered (with the test) or No test. Comments are tagged Blocking, Suggestion, or Question. Also **Code** (file tree and diff) and **Conversation** (the pull request's comments).
- **Right column:** progress by risk, untested paths, blast radius (callers, schema changes, feature flags, rollback), and the reviewer's comments.
- **Decision:** **Approve on GitHub** unlocks when the high-risk stops are reviewed and no comment is blocking. **Request changes** needs at least one comment; the comments become proposals in the assignee's Feedback queue, and the reviewer gets a re-review of only what changed. Approval is posted to GitHub as the reviewer, with their own GitHub authorization, which is where the SOC2 record lives.

## 10. Engineer tools

For engineers to work in Orc and leave only to debug (0029).

- **Take over** (FR-11, FR-87): pauses the agent, pushes its work so far, and offers to open the branch in VS Code, Cursor, or JetBrains, or shows the `git switch` command. The task reads "<name> has control". **Hand back to Orc** summarizes the person's commits, re-runs checks, and continues. Taking over asks one optional question, **why are you leaving Orc?** (Debugging, A quick fix, Finding my way around, Environment, Something else). The answers measure what Orc still lacks.
- **Inline edits** in the walkthrough and diff (FR-91, §6).
- **Repo browser** (FR-106): the task's repo at its branch: files, search across files and code, and select a name to see its definition and every usage.
- **Agent transcript** in the Log (FR-107, §8).
- **Sandbox details** in the left column: whether the run's environment matches local (runtime versions, services, seed data, secrets source) and its health.
- **Command palette (⌘K, FR-109):** every action, filterable, with its keyboard shortcut (j and k between tasks that need you, `/` to ask, `g r` for the repo, `t` to take over, `?` for all shortcuts).
- **Steer a run** (FR-103): a running task's Build screen has a box to message Orc: **Interrupt now** or **Send after this step**. Each message shows whether Orc applied it or queued it.
- **Terminal** (FR-104): a shell into the same sandbox the agent uses, while the run is paused or taken over, with suggested commands (run a test, read the log, query the seeded database). Commands are recorded for audit.
- **Ask the codebase** and **scratch sessions** (FR-105): questions that don't need a task, answered with links to the files; an answer can become a task or a scratch session, a draft task with a branch that stays out of the tracker and pull requests until promoted.

## 11. Archiving

Any task can be archived from Gone quiet or from Details (FR-100, 0030). A reason is required: No longer needed, Duplicate of another task (name it), Done another way, Won't do, or Other (explain). Archiving also closes the item in the tracker with the reason, because the tracker is the record. The task leaves every list; a strip offers Undo, and Restore (which reopens the tracker item) is in the task list's Archived group.

## 12. Views by role

What the task page shows by default depends on the person's roles (FR-51). Anyone can switch to the full view if their access allows.

| Role | Default view |
|---|---|
| **Engineer** | Everything: code in the walkthrough, the Code section, manual edits, Take over, the agent transcript, PR reviews |
| **Designer** | The walkthrough with screenshots and design comparison; no code |
| **Product** | The walkthrough, spec and criteria, plain-language summaries; no code |
| **Support** | Investigate findings in plain language, and evidence; no code |

Non-engineers never see Take over or Continue anyway; they get **Hand to an engineer** and **Ask an engineer** instead.

## 13. Where these decisions came from

The layout, stages, walkthrough, pull request review, engineer tools, editing, and archiving were decided in the design review recorded in ADRs 0027 to 0030, which supersede parts of 0025 and 0026. The design boards in [design/](design/README.md) show each screen with sample data.

## 14. Other pages

- **First-time setup** (FR-1, FR-3): shown to Admins until done. Connect GitHub (the GitHub App), the issue tracker, the identity provider, email, and the LLM provider (plus Bedrock for embeddings when the provider is the Anthropic API, ADR 0023); then onboard repos, where Orc works out and verifies each repo's build-and-check settings, and code owners set protected paths and fast-lane thresholds.
- **Insights:** usage, cost, and quality trends by workflow, team, repo, and over time; skill performance and version comparisons (FR-50, FR-56); how often engineers leave Orc and why (§10).
- **Learning:** proposed and active lessons, approvals, and conflicts (FR-68, FR-72).
- **Settings,** by access level: organization, teams and roles (including which workflows each role may start, FR-57), repos and onboarding (FR-3), products (FR-2), policy and approvals (FR-20), spending caps (FR-48), sandbox slots and warm pool (ADR 0024), integrations, the pause switch (FR-83), and the **audit log** (Q-AUD-1): every action record, approval, policy change, pause, and restore, filterable and exportable.

## 15. Delivery

- **v1 order.** First release: first-time setup, Home, tasks (every workflow and stage), PR review, and Settings including the audit log. Second release: Insights and Learning. The interface shows only what's released.
- **Live updates.** Polling through TanStack Query: open tasks, Home, and counts refresh every few seconds while something is queued or running, and slow down when nothing is. Server-sent events are [later], if polling feels slow or costs too much.
- **Notifications.** No bell or notification centre. "Needs you" carries a count, and Orc's messages also go by email and tracker mention as each person chooses (FR-80).
