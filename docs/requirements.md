# Orc — Requirements

> **Orc** (short for *Orchestrator*) is a new product; this file is its starting point.
>
> This file says **what Orc must do**, not how. Requirement IDs are stable once shared, so they can be referenced in discussion and later in tickets. ⚠️ marks open questions. **[later]** marks requirements kept for the long-term design but not built in v1.

## 1. Purpose

Orc is an organization's engineering memory and quality system for AI-assisted work. It learns how the organization wants its code to look, how it writes specifications, and how it makes decisions. It applies that knowledge to the work it does, and it measures whether the work is getting better.

To do that, Orc lets a team hand well-defined engineering work to AI, across any of their repos, while humans stay in control of every decision that matters. That work includes specifying, developing, and shipping features, investigating bugs, and drafting documentation. Orc gives the team one place to see what the AI did, what it cost, and whether it was any good.

Orc is for any organization that tracks work in GitHub Issues or Jira and keeps code on GitHub (GitLab and other issue trackers [later]). Each organization's data is isolated from every other's.

### What Orc is built around

The lasting value of Orc is what it knows and how it checks itself, not the agent that writes the code. The core is:

* **Learning and memory:** lessons about code, specifications, and decisions, owned by the organization, approved by people, and scoped to a repo, a team, or the whole organization.
* **Measured quality:** every skill and lesson is measured, and regressions are caught before production.
* **Specification quality:** good input is the main limit on dependable output, so Orc treats writing specifications as first-class work.
* **Verification:** Orc proves its work against the specification instead of leaving that to the reviewer.
* **Policy and human control:** admin rules and approval points that nothing in a repo or work item can loosen.

Everything else is replaceable and should stay that way: the coding agent, the execution environments, the model, and where work is triggered from (Q-ORG-4, Q-ORG-5). As platforms improve, Orc can swap in better parts. If another platform's agent becomes better than Orc's own, Orc can supply its lessons and skills to that agent and measure the results.

### Why Orc, given what already exists

Turning an issue into a pull request is now available inside issue trackers and from several vendors, and coding agents are starting to keep their own memory. Orc exists for what those don't give us together:

* learning that spans the organization and teams, not just one user or repo, and covers specifications and decisions as well as code;
* learning that is measured and approved, not just accumulated;
* lessons and skills the organization owns and can use with any agent, not locked to one vendor;
* workflows beyond coding (Spec, Investigate, Document) under one set of rules;
* AI usage running in, and billed to, the organization's own account with its LLM provider;
* skills people can run locally in their own AI tools, identical to what runs in production.

## 2. Scope

**In scope for v1:** one organization; GitHub; the spec, develop, ship, investigate, and document workflows; a web interface and a command line; notifications through the issue tracker and email.

**Out of scope for v1:** GitLab; multiple organizations and the Operator role; chat tools (e.g. Slack, Microsoft Teams); issue trackers other than GitHub Issues and Jira Cloud; LLM providers other than Bedrock and the Anthropic API; organization-defined custom workflows; long-lived interactive remote environments.

## 3. Glossary

| Term | Meaning |
|---|---|
| **Organization** | A company using Orc. The unit of data isolation. |
| **Team** | A group of people within an organization. |
| **Work item** | A GitHub issue or Jira work item (task, bug, story, or similar) that Orc works on. |
| **Workflow** | A kind of work Orc does: Spec, Develop, Ship, Investigate, or Document. |
| **Run** | One execution of a workflow on one work item, from start until it stops. |
| **Step** | One unit of work within a run. |
| **Skill** | A packaged, versioned AI capability that workflows use and that people can also use directly. |
| **Proposed change** | A branch plus a pull request that Orc opens for human review. A work item that spans several repos has one proposed change per repo. A proposed change may be split into a stack of dependent pull requests in the same repo. |
| **Review comment** | A comment Orc leaves on a proposed change, attached to a line, a range of lines, or a file. Not part of the code. |
| **Execution environment** | The isolated place where Orc installs, builds, tests, and runs a repo's code for one run. |
| **Designs** | Visual references attached to a work item (e.g. design-tool frames or images) that the built result should match. |
| **Knowledge source** | Material an organization designates as authoritative — product terminology, definitions, style guides. |
| **Lesson** | Something learned — by a person or from past work — that Orc should apply to future work. |
| **Policy** | Admin-set rules on what Orc may do: which workflows run on which repos, which paths it may change, required approvals, autonomy thresholds, spending caps. |
| **Build-and-check settings** | How to install, build, lint, test, and run a repo's code. |

## 4. Users

Every user has one or more **roles**, one **access level**, and belongs to one or more **teams**.

### Roles

A role tells Orc what kind of knowledge a person has — so Orc knows **how to communicate with them** and **what they may work on**.

| Role | Needs to |
|---|---|
| **Engineer** | Hand work items to Orc, review its code, approve, redirect, or take over its work, use the same skills locally |
| **Designer** | Provide designs for a work item and confirm that what Orc builds matches them |
| **Support** | Get a trustworthy diagnosis of a customer-reported bug without needing an engineer |
| **Product** | Get well-specified work items and accurate first drafts of documentation |

### Access levels

Any role can hold any level.

| Level | Can |
|---|---|
| **Member** | Do the work their roles allow |
| **Manager** | Everything a Member can, plus for their teams: see usage, cost, and quality; set spending caps; manage who is on the team and their roles. Organization-wide: approve, edit, and retire lessons |
| **Admin** | Everything, organization-wide: connected systems, repos and onboarding, policy, teams, roles and access levels, spending caps, knowledge sources, approved skill versions, lessons |
| **Operator** [later] | Runs an Orc deployment: creates organizations and monitors Orc's health. Sees no organization's work items, code, or outputs unless that organization grants access. |

## 5. Constraints

Givens, not choices:

* **C-1** — GitHub Issues and Jira Cloud are the issue trackers in v1; an organization uses one or both. Other trackers are [later] and must be possible without reworking the workflows.
* **C-2** — Repos live on GitHub in v1. GitLab support is [later] and must be possible without reworking the workflows.
* **C-3** — The LLM provider is chosen per organization, from AWS Bedrock and the Anthropic API in v1, and used through **the organization's own account** with that provider. An organization on the Anthropic API also connects Bedrock for embeddings. Orc itself runs on infrastructure we operate (see Q-ORG-3).
* **C-4** — Built in TypeScript.
* **C-5** — Every API is described by an OpenAPI specification.
* **C-6** — Orc can be operated within a SOC2-audited environment, and gives each organization the controls and evidence its own SOC2 audit needs (see [Audit and compliance](#audit-and-compliance)).

## 6. Functional requirements

### Organizations and setup

* **FR-1** — An organization's Admins can connect GitHub, an issue tracker (GitHub Issues, Jira, or both), email, the organization's identity provider, and an LLM provider account. All AI usage runs in, and is billed to, the organization's own account with that provider. [later: an Operator creates the organization; its Admins then connect everything without Operator help.]
* **FR-2** — Admins can describe the organization's products and how they map to repos, so Orc can place work items correctly.
* **FR-3** — Admins can onboard every repo in the organization in bulk. Orc works out each repo's build-and-check settings from what the repo already contains, verifies them by actually running them, shows a preview of the results, and saves nothing until an Admin confirms.

### People across systems

* **FR-4** — Orc knows which GitHub and Jira accounts and sign-in identity belong to the same person, and uses that person's roles and access level whichever system they act from.
* **FR-5** — When someone Orc doesn't recognize acts on a work item, Orc does nothing on their behalf and tells them how to get access.

### Starting, continuing, and stopping work

* **FR-6** — Users can start any workflow from the issue tracker or the command line. ⚠️ Whether "from the issue tracker" means assigning the item to Orc, a comment command, or both — including whether Orc uses Jira's own agent-assignment model — is open (see §9).
* **FR-7** — A work item has at most one run in progress at a time.
* **FR-8** — Only an explicit action by a permitted user starts or continues a run. Talking with Orc never does on its own (FR-77). Explicit actions include: starting a workflow, answering Orc's questions and asking it to continue, an approval decision, a reviewer requesting changes on Orc's proposed change, confirming a follow-up request (FR-78), and a CI failure or merge conflict on Orc's own proposed change where Admin policy lets Orc respond to those automatically (FR-86).
* **FR-9** — When a run continues after stopping for input, Orc picks up where it left off — it doesn't repeat work or re-ask answered questions.
* **FR-10** — A permitted user can cancel a run at any time. Orc stops cleanly and reports what it had done.
* **FR-11** — An engineer can take over a run's work — Orc stops, and its branch and findings are left in a state a person can continue from.
* **FR-87** — When a person has added commits to Orc's branch and asks Orc to continue, Orc builds on their commits. It never rewrites or discards a person's work (e.g. no force-push over it), and it says what it understood their changes to do before going further.
* **FR-12** — If a work item changes while Orc is working on it, Orc notices, says so, and uses the latest version when work continues.
* **FR-13** — Orc stops and asks for help, rather than looping, when repeated attempts at a step aren't making progress. Every retry loop has a limit: attempts at a step, review-and-revise rounds (FR-15), and full check runs (lint and tests). Admins can set each limit; defaults are small (single digits; check runs no more than 2–3). Reaching a limit stops the run and says which limit was hit and what was tried.

### Workflows

* **FR-14 — Spec:** turn a work item into a specification complete enough to develop from. Orc judges completeness, asks specific questions where the work item is thin, and proposes the missing detail in the work item itself for a human to accept or edit. A complete specification includes acceptance criteria that can each be checked, so Develop can prove it met them.
* **FR-15 — Develop:** turn a work item whose specification is complete into a tested code change on its own branch. The specification may come from Spec or be written entirely by a person. Starting Develop is the human's approval of the specification.
  * Before writing code, Orc judges whether the work item is within what it can do reliably in that repo, and declines with an explanation when it isn't.
  * When the specification leaves out something the work needs, Orc stops and asks rather than filling the gap with a guess.
  * The change is reviewed before it is proposed — for security, correctness against the specification, impact on surrounding code, consistency with the repo's conventions, and test coverage — and revised until the review passes or Orc stops and asks for help.
  * The repo's own lint and tests pass.
  * Orc proves the change does what the specification asks. For each acceptance criterion it produces evidence — a test that exercises it, output from running the code, or a screenshot of the running app. New or changed behaviour is covered by tests where the repo supports it. Where Orc can't verify a criterion, it says so plainly instead of implying it was checked.
  * When designs are attached, the running result is checked against them.
  * Commits are organized so a reviewer can follow them in order — each commit does one kind of thing (e.g. a refactor separate from the behaviour change it enables).
* **FR-16 — Ship:** open the developed change as a proposed change that a reviewer can act on (see [Reviewability](#reviewability)). Revise it when a reviewer requests changes. Report when it's ready for a human to merge.
* **FR-17 — Investigate:** turn a bug report into one of: a confirmed root cause with a recommended next step, specific questions for the reporter, or an escalation to engineering. Never changes code.
  * Orc reproduces the bug where it can, and says whether a root cause was confirmed by reproducing it or only inferred from evidence.
  * When the fix needs code, Orc adds a proposed fix to the work item, written so that Develop can start from it once a person has reviewed it.
  * When the fix needs no code (e.g. it's already deployed, or needs a manual action), Orc says so instead.
* **FR-18 — Document:** turn a documentation request and its sources into a draft that is accurate to the code and sources and consistent with the organization's knowledge sources. Never publishes.

### Reviewability

* **FR-59** — The description of a proposed change says what the goal is, and gives only the context that spans several files and so can't sit next to any one piece of code. It also lists the verification evidence for each acceptance criterion (FR-15), including any criterion Orc couldn't verify, and anything the reviewer must check outside the code (e.g. configuration, data, order of deploy).
* **FR-60** — All other context sits as close to the code as possible: on the line or lines it's about where it can, otherwise on the file. Context is never placed further from the code than it needs to be.
* **FR-61** — Review comments point the reviewer at decisions, assumptions, uncertainty, and risk — "I wasn't sure whether X; check Y." They never argue that the code is correct or try to lead the reviewer to approve.
* **FR-62** — When a change is easier to review in dependent parts, Orc can propose it as a stack of pull requests in the same repo, ordered so each can be reviewed and merged from the bottom up. ⚠️ GitHub's stacked pull requests are in public preview (July 2026); Orc must still work if the feature is unavailable.

### Change safety

* **FR-84** — When a proposed change adds or upgrades a dependency, Orc confirms the package exists in the official registry under that exact name, and checks its known vulnerabilities and license against Admin-set policy. Each new dependency is called out to the reviewer. A dependency that fails policy stops the run and says why.
* **FR-85** — Orc scans every change for credentials and secrets before pushing it. If it finds one, it doesn't push, and it tells the right person what kind of secret it found and where, without repeating it.

### Keeping proposed changes healthy

* **FR-86** — Orc watches the repo's own CI on its proposed changes, and notices when the target branch moves on and causes merge conflicts. It fixes failures and conflicts caused by its own change, within the limits of FR-13. It reports failures it didn't cause instead of trying to fix them, and stops and asks when resolving a conflict needs a judgment call. Admin policy decides whether Orc does this automatically or waits for a person's go-ahead.
* **FR-88** — Orc tracks its open proposed changes. One with no review activity for an Admin-set period is flagged to the people on the work item. Orc closes a proposed change only when a person confirms. When Orc can't act on feedback (e.g. it's subjective or contradictory), it says so and asks, rather than going quiet.

### Human control

* **FR-19** — Orc never merges code, publishes content, or starts a workflow on its own; one workflow never triggers another. Moving a work item from Spec to Develop to Ship is always a person's action.
* **FR-20** — Admins can require human approval at defined points in a workflow. Anyone whose role allows them to work on that workflow can approve, send back with feedback, or reject — from the issue tracker, the command line, or the web interface.
* **FR-21** — When Orc can't proceed, it stops and asks the right person specific questions — including exactly what's wrong with any input it can't use (e.g. a design link that doesn't point at a specific design).
* **FR-22** — Anything Orc produces for external audiences is a draft until a person publishes it.
* **FR-83** — Admins can pause Orc instantly for the whole organization, one workflow, or one repo. Runs in progress stop cleanly at once, no new runs start, and everyone affected is told. Only an Admin can resume, and pausing and resuming are recorded for audit.

### Repos

* **FR-23** — Orc works on any repo on GitHub without changes to Orc itself. [later: GitLab.]
* **FR-24** — Orc works on a repo that contains no Orc-specific files.
* **FR-25** — Repo owners who want to can keep the repo's build-and-check settings versioned alongside their code instead of only in Orc.
* **FR-26** — Admins can give Orc context about a repo — its conventions, architecture, and things to avoid — without adding files to the repo.
* **FR-27** — Nothing in a repo can loosen the policy Admins have set for it.
* **FR-28** — Orc never adds its own tooling, configuration, or working files to a repo as part of other work; a proposed change contains only what the work asked for. Review comments and the description are not part of the repo and are allowed.
* **FR-29** — Everything Orc contributes to a repo (branches, proposed changes, comments) is clearly identifiable as AI-authored.
* **FR-30** — Orc works out which repos a work item involves — one or several — or asks.
* **FR-31** — Orc supports these repo shapes specifically:
  * **Monorepos** — several projects in one repo.
  * **pnpm workspace repos** — packages managed as a pnpm workspace.
  * **Submodule repos** — repos composed of other repos via git submodules, where work may span the parent and its submodules.
* **FR-32** — A single work item can span multiple repos:
  * Develop makes the changes in every repo the work item needs, and tests them together where the repos depend on each other.
  * Ship opens one proposed change per repo, links them to each other and to the work item, and states any order they must be merged in.
  * Revisions and cancellations apply to the whole set; the work item isn't reported ready until every proposed change in the set is.
  * Investigate may look across related repos when the evidence points elsewhere, and says which repos it examined.

### Running code safely

* **FR-33** — Orc can install, build, test, and run a repo's code, including booting an app to check its visual output against designs.
* **FR-34** — Code Orc runs can't reach Orc's credentials, other repos, or systems it has no need for.
* **FR-63** — Each run gets its own execution environment. No two runs share one, and nothing from one run is visible to another.
* **FR-64** — A run's execution environment survives the run stopping for input, so work continues from the same state (FR-9). It is destroyed when the run ends, or after an Admin-set idle limit, after which continuing rebuilds it from the branch.
* **FR-65** — An execution environment has a maximum lifetime and resource limits set by Admins. Reaching one stops the run and says why.
* **FR-66** — Admins can see which execution environments exist, for which runs, and remove any of them.

### Skills

* **FR-35** — Skills are reusable, versioned, and releasable independently of Orc.
* **FR-36** — Any user can run the same skills locally, in their own AI tools, that Orc runs in production. Skills use a widely supported format rather than one only Orc understands.
* **FR-37** — Any user can contribute and share skills within their organization, including skills unrelated to Orc's workflows.
* **FR-38** — Before a skill is shared, the permissions it asks for are shown to reviewers.
* **FR-39** — Production runs use only approved skill versions, never whatever changed most recently.

### Knowledge

* **FR-40** — Admins can register knowledge sources; Orc uses them for terminology and definitions and flags where code and a knowledge source disagree.
* **FR-41** — Orc retains lessons — from people or from past work — and applies relevant ones to future work. When a person's correction contradicts Orc's earlier conclusion, Orc proposes a lesson for approval (FR-68).
* **FR-42** — A user can give Orc a sample of their writing, and Orc matches that voice in prose it writes on their behalf (e.g. work item descriptions, proposed-change descriptions).

### Learning

* **FR-67** — Orc learns how the organization wants its code to look and how it makes decisions, from the comments, review feedback, and requested changes on the work items and proposed changes Orc itself worked on, and from conversations about that work (FR-81). It never learns from work it wasn't part of. When a pattern recurs (e.g. reviewers repeatedly asking for the same kind of change), Orc proposes a lesson, with links to the comments it came from.
* **FR-73** — Orc learns to write better specifications the same way it learns to write better code. Sources include: the edits people make to specifications Orc proposed; questions Develop had to ask because a specification left something out; and review feedback on proposed changes that traces back to something the specification missed. Spec lessons follow the same approval, scoping, measurement, and tracing rules as other lessons (FR-68–FR-72).
* **FR-68** — No lesson is applied until it is approved. Any Manager or Admin can approve a lesson of any scope; who should approve what is for the organization to decide outside Orc. Anyone can flag a comment as a possible lesson, but only Managers and Admins approve.
* **FR-69** — Every lesson has a scope — a repo, a team, or the organization — and is versioned. Any Manager or Admin can edit, retire, or set an expiry on any lesson.
* **FR-70** — A new or changed lesson is measured like a skill change (FR-43, FR-46); one that makes Orc measurably worse is caught before it is applied.
* **FR-71** — Every run records which lessons it applied, so a bad lesson can be traced and removed.
* **FR-72** — When comments or lessons conflict (e.g. two reviewers asking for opposite things), Orc doesn't pick one. It raises the conflict for a Manager or Admin to resolve.
* **FR-74** — Other agents can use an organization's approved lessons and skills while they work, not only Orc. Orc provides them:
  * through an MCP server, the main delivery route, so an agent can ask which lessons apply to a given repo and kind of work and get back only approved, current ones;
  * through the API (FR-54), for tools that don't support MCP;
  * as an export in a widely supported format (e.g. skill files) for local or organization-level agent configuration. Exports are never written into a working repo (FR-24, FR-28).
* **FR-75** — Access to lessons and skills from outside Orc follows the same roles, access levels, and organization isolation as everything else. Orc records which lessons and skills it served, to which agent and user, and for which repo. A retired or expired lesson stops being served immediately.
* **FR-76** — Lessons used by outside agents are counted as unmeasured unless the agent reports back which lessons it applied and to what work. When it does, those uses are traced (FR-71) and can be measured like Orc's own (FR-70).

### Measuring quality

* **FR-43** — Every skill's quality can be measured against real cases and compared between versions. Measurements can't see information the original work didn't have (e.g. the eventual fix).
* **FR-44** — A new organization can build its first cases from its own history — past work items and the changes that resolved them.
* **FR-45** — When a person corrects Orc's work, that correction can become a new case.
* **FR-46** — A change that makes a skill measurably worse is caught before it reaches production.
* **FR-82** — Changing the AI model Orc uses (including a new version of the same model) is measured like a skill change. Production runs use only approved model versions, and a model change that makes any workflow measurably worse is caught before it reaches production.

### Cost, usage, and capacity

* **FR-47** — Every run and step is recorded: what, for which work item and repos, how long, what it cost, and how it ended.
* **FR-48** — Spending can be capped per run, per team, and per month — by Managers for their teams and by Admins for the organization. A run that would exceed a cap stops and says why.
* **FR-49** — When Orc is at capacity, work waits in a queue shared fairly across teams, and users can see where their work is.
* **FR-50** — Users can see usage and cost.

### Communication and conversation

* **FR-51** — Orc tailors how it communicates to each person's role — plain language and no code for non-technical roles, technical detail for engineers — and when a message goes to several roles, it gives each what they need.
* **FR-52** — The right people are told when Orc needs a decision, needs information, or finishes — on the work item, by email, and in the web interface.
* **FR-53** — Orc writes to each issue tracker in that tracker's native formatting (GitHub-flavored Markdown for GitHub Issues, Atlassian Document Format for Jira).
* **FR-77** — Users can talk with Orc about any run, during it or after it ends, from the issue tracker, the command line, or the web interface. They can ask what it did, why it made a decision, what it checked, and which lessons it applied. Orc answers from the run's record, says when it doesn't know, and changes nothing while answering.
* **FR-78** — After a run ends, a permitted user can ask Orc for follow-up work on the same work item (e.g. "also handle the empty state"). Orc restates what it will do and which workflow it will use, and starts only once the user confirms. Follow-up work continues from the earlier run's results rather than starting over.
* **FR-79** — Orc can start a conversation with a user, not only reply. It messages people to ask a question, request a decision, report progress on long runs, flag a risk it found, propose a lesson, or say that a limit or cap was reached. Every message is linked to the work item or run it's about, and the user can reply in the same place.
* **FR-80** — Each user chooses where Orc reaches them (e.g. a mention in the issue tracker, email, the web interface) and which kinds of messages they receive right away, receive as a digest, or don't receive. Messages that block work (questions and decisions) can't be turned off, only redirected.
* **FR-81** — Conversations with Orc are kept with the run they're about. A correction made in conversation can become a proposed lesson (FR-41, FR-67), following the same approval rules as any other lesson.

### Interfaces

* **FR-54** — Everything a user can do, they can do through a documented API; the command line and the web interface offer nothing the API doesn't.
* **FR-55** — People who don't use the command line can use Orc fully through the issue tracker and the web interface.
* **FR-56** — The web interface is for seeing, configuring, and deciding — not for starting workflows. In it, users can:
  * browse runs and see, for any run, what triggered it, each step, what it produced, where it stopped and why, and what it cost;
  * see usage, cost, and quality trends by workflow, team, repo, and over time;
  * see how each skill is performing and how versions compare;
  * act on pending approvals;
  * talk with Orc about any run, and see and reply to messages Orc has sent them;
  * compare what Orc built against a work item's designs;
  * manage everything their access level allows them to configure.

### Roles and access

* **FR-57** — What a person may work on comes from their roles; what they may manage comes from their access level, scoped to their teams (Managers) or the whole organization (Admins). Admins can exclude a repo from any workflow.
* **FR-58** — People sign in with their organization's existing identity provider.

## 7. Quality requirements

### Reliability

* **Q-REL-1** — Runs lasting an hour or more survive Orc restarts, deploys, and crashes without being lost or done twice.
* **Q-REL-2** — Orc stays available during deploys and single-machine failures.

### Performance

* **Q-PERF-1** — A run's execution environment is ready to work, with the repo checked out and dependencies installed, quickly enough that handing work to Orc doesn't feel slower than starting it locally. ⚠️ Target to be set after measuring real repos.

### Security

* **Q-SEC-1** — Orc treats work item content, repo content, and conversations with Orc as untrusted, including attempts to manipulate the AI. Anyone who can edit a work item, comment on it, message Orc, or change a repo can try to steer Orc; Orc's safety must not depend on the AI ignoring them.
* **Q-SEC-2** — Orc's own credentials are scoped to the minimum and every use is audited.
* **Q-SEC-3** — Orc makes its best effort to keep personal data (PII) out of everything it sends to an AI model. Detection can't be perfect, so the requirement is that the checks are thorough and consistent, not that they're guaranteed:
  * every request to a model passes through a single checkpoint in Orc; nothing reaches a model any other way;
  * detected PII is replaced with consistent placeholders (e.g. `<EMAIL_1>`) so the work can still be reasoned about;
  * content that can't be safely masked stops the run, and the right person is told what kind of data was found and where, without repeating it;
  * Orc records what kinds of PII it masked for each run, so gaps can be found and the checks improved;
  * what counts as PII, and any stricter rules for particular workflows (e.g. Investigate reading logs), is configurable per organization.
* **Q-SEC-4** — Execution environments hold no credentials that can write to GitHub, Jira, or any other system. Every external change (push, comment, work item update, message) is made by Orc outside the execution environment, after checking it against policy.
* **Q-SEC-5** — Execution environments can reach only the network destinations their work needs (e.g. package registries), from an Admin-managed allowlist. Everything else is blocked and logged.
* **Q-SEC-6** — Every action Orc takes in an external system is one of a fixed set of kinds declared for that workflow and step (e.g. "comment on this work item", "push to this branch"). Nothing the AI produces can make Orc take an undeclared kind of action or act on a different work item, branch, or repo.
* **Q-SEC-7** — When content looks like an attempt to steer Orc, Orc stops the run and tells the right person where it was found, rather than quietly ignoring it.

### Data

* **Q-DAT-1** — An organization's data is never used to train AI models.
* **Q-DAT-2** — Each organization sets how long Orc keeps its data; deletion removes everything derived from it, including search indexes and captured screenshots.
* **Q-DAT-3** — An organization can export its data.
* **Q-DAT-4** — Lessons, skills, settings, and run records are backed up, and can be restored to an earlier point in time. Any bulk change to lessons can be undone. Restores are an Admin action and are recorded for audit.

### Audit and compliance

* **Q-AUD-1** — Every external change Orc makes and every human decision in a workflow is recorded for audit.
* **Q-AUD-2** — Every proposed change carries a record of the reviews and checks it passed.
* **Q-AUD-3** — Admins can review who has which roles and access levels, and when that changed.

### Operability

* **Q-OPS-1** — A non-production copy of Orc can run against the same issue tracker projects and repos as production without interfering with it.
* **Q-OPS-2** — Any run can be traced end to end across every part of Orc.
* **Q-OPS-3** — Changes to Orc can be tested against real systems before they reach production.

### Organizations

* **Q-ORG-1** — Each organization's data — work items, code, runs, outputs, lessons, knowledge sources, skills, usage, settings, and audit records — is isolated from every other organization's. No organization can see or affect another's data or work. In v1 there is one organization, but all data is scoped to an organization from the start.
* **Q-ORG-2** — Nothing specific to any one organization is built into Orc; each organization's needs are met through configuration and extensions.
* **Q-ORG-3** — Orc can be deployed on any infrastructure that can run it; it assumes no specific hosting setup.
* **Q-ORG-4** — Each external system Orc talks to can be swapped for another of the same kind — including the code host and the provider of execution environments.
* **Q-ORG-5** — Integrations are extendable. Each kind of integration — issue tracker (GitHub Issues, Jira), code host (GitHub), notifications (email), identity provider, LLM provider, execution environment, and chat [later] — is defined once as a contract. Adding another integration of the same kind (e.g. GitLab, Linear, Microsoft Teams) means implementing that contract, without changing the workflows or the other integrations. Organizations can run more than one integration of a kind where that makes sense (e.g. GitHub and GitLab side by side).

## 8. Success measures

How an organization knows Orc is working:

* **Spec:**
  * share of specifications accepted with little or no editing;
  * share of Develop runs that stopped for detail the specification should have had;
  * share of review feedback that traces back to a gap in the specification.
* **Develop / Ship:**
  * share of proposed changes merged;
  * share of acceptance criteria backed by verification evidence;
  * review rounds before merge;
  * share of proposed changes closed without merging, or left without review activity past the Admin-set period;
  * time from opening a proposed change to first review and to merge;
  * share of merged changes reverted, or with defects traced to them, within 30 days;
  * share of Develop runs declined vs. attempted. A decline is a correct outcome when the work was beyond what Orc does reliably; it is not counted as a failure.
* **Investigate:** share of confirmed root causes that the eventual fix agreed with; share confirmed by reproducing the bug.
* **Document:** how much drafts change before publishing.
* **Cost:** cost per merged change, per confirmed diagnosis, and per published document.
* **Adoption:** active users and runs per team over time.

## 9. Open questions ⚠️

* **Trigger model:** should Orc start work when an item is assigned to it, on a comment command (e.g. a label or `@orc`), or both? Jira now lets work items be assigned to AI agents directly; GitHub has bot assignment. (Feeds FR-6, FR-8.)
* **Workflows per role:** which workflows can each role work on? For example, can Support start Develop, or only Investigate? (Feeds FR-57.)
* **Document scope:** which destinations (e.g. help center, internal knowledge base) are in v1?
* **Custom workflows:** should organizations eventually define their own workflows?
* **Web interface in v1:** everything in FR-56 at launch, or run history and settings first, with trends and quality views after?
* **Machine identity:** how do automated parts of Orc and its integrations prove who they are?
* **Deployment model [later]:** once Orc serves other organizations — one deployment for many, one per organization, or both?
* **Cross-organization sharing [later]:** can an organization choose to publish skills for others, or do skills never leave their organization?
* **Licensing and naming [later]:** checks before Orc is offered to other organizations.
