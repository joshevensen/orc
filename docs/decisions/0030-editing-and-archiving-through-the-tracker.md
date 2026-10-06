# 0030 — People edit and archive tasks in Orc; the tracker stays the record

**Status:** Accepted · **Date:** 2026-10-06 · **Supersedes in part:** 0025 (no editing of tracker items in Orc)

## Context
0025 kept item edits in the tracker to avoid two-way sync. In practice, people working a task in Orc need to fix the problem statement, scope, or criteria, or change the assignee, without switching tools, and stale tasks pile up with nobody deciding whether they still matter. Jira (or GitHub Issues) is still the source of truth.

## Decision
- **Edits in Orc are written to the tracker.** People can edit the problem, scope, notes, acceptance criteria, and assignee in Orc. Each edit is written to the tracker item as that person, recorded in the run record, and can be undone. Orc never holds a second copy that disagrees with the tracker.
- **Stage rules for edits:** the assignee can change at any stage. Problem and scope can change at any stage, but after Build has started, saving sends the task back to Analyze through the going-back confirmation (0027). Criteria can change only in Spec and Analyze; later, go back to change them. Notes never change the stage. While a run is in progress, problem and scope wait until it pauses.
- **Ask Orc to edit.** People can ask Orc to make an edit instead; Orc applies it directly, recorded and undoable like a person's edit.
- **Archiving requires a reason** (no longer needed, duplicate of a named task, done another way, won't do, or other with an explanation) and always archives the tracker item too, with the reason. Restoring reopens it.
- **Gone quiet.** Tasks with no activity for 30 days are listed for a decision. Keeping one posts "<name> decided to keep this task open" to the task and the tracker, which restarts the 30 days.
- **Due dates come from the tracker** and are optional.

## Alternatives considered
- **Proposed edits only (FR-14).** Rejected for people's own edits: a person editing a field is the decision. Spec's proposals to the item still go through accept, edit, or reject.
- **Archive in Orc only.** Rejected: the tracker is the source of truth, so the two would disagree.
- **Snooze quiet tasks silently.** Rejected: the comment records the decision where planners can see it.

## Consequences
- The `IssueTracker` contract needs field updates (description sections, assignee), transitions (archive, reopen), and comments as a person.
- Each new kind of tracker write is a declared action (Q-SEC-6).
- Edit conflicts are possible when someone edits the same item in the tracker; Orc shows the tracker's latest version (FR-12) and asks before overwriting.
