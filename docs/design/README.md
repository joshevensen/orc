# Orc — Design reference

The visual design for Orc's web app. [interface.md](../interface.md) says how the app is laid out and behaves; these files show what it looks like. When the two disagree, interface.md wins and the design should be updated.

The files are Design Component (`.dc.html`) prototypes made in Claude Design. They need Claude Design's runtime (`support.js`), so they won't render on their own from this folder. Read them for structure, styles, copy, and sample data. The live canvas, with all five boards side by side and clickable, is the source they came from.

## Boards

| File | Screen | Who |
|---|---|---|
| [Home.dc.html](Home.dc.html) | Home: agents running, needs you, due soon, ready for review, to do, gone quiet, PR reviews, waiting on others, recently done | Engineer |
| [Console.dc.html](Console.dc.html) | Task console: pipeline, task info, the stage's screen, criteria, and the next action. Nine sample tasks cover every stage | Engineer |
| [ReviewPR.dc.html](ReviewPR.dc.html) | PR review: a team review task for another engineer's pull request | Engineer |
| [HomeNonEng.dc.html](HomeNonEng.dc.html) | Home | Designer and Product |
| [ConsoleNonEng.dc.html](ConsoleNonEng.dc.html) | Task console | Designer and Product |

The Engineer and Designer/Product boards are the same file with a different default for the `role` prop (`eng` or `non`). [canvas.json](canvas.json) is the canvas layout.

## Visual language

A heads-up display: dark, warm near-black surfaces; thin chamfered frames; one accent colour. The tokens are in [`apps/web/src/styles.css`](../../apps/web/src/styles.css) as Tailwind theme variables and shadcn/ui colour variables, so components get them without copying values from these files.

### Colour

Moss is the accent and means **interactive or active**: links, buttons, focus rings, the current pipeline stage, running indicators, and the action bar. Static things (panel borders, section tabs, labels, titles) are neutral. Every text pair meets WCAG AA (4.5:1); form-control borders meet 3:1.

| Token | Value | Use |
|---|---|---|
| `void` | `#030302` | Page background |
| `bg` | `#060503` | Grid background inside the frame |
| `panel` | `#0b0a05` | Panels |
| `raised` | `#14120a` | Buttons, hover, inputs |
| `line` | `#2c2a14` | Dividers |
| `frame` | `#4a4730` | Panel outlines |
| `frame-hi` | `#7b7758` | Corner brackets |
| `moss` | `#b8ab3e` | Accent |
| `moss-dim` | `#77701f` | Button borders, the task switcher outline |
| `text` | `#e6e2c8` | Body text |
| `muted` | `#a19d7c` | Secondary text |
| `gutter` | `#878369` | Line numbers, not-started stages |
| `success` | `#4fd69c` | Done, verified, passing |
| `warning` | `#ff9a3c` | Needs you, blocked, missing |
| `error` | `#ff5a4d` | Failed |
| `info` | `#5fb4ff` | Waiting on others, take over |

### Type

| Size | Use |
|---|---|
| 11px | Labels and meta. Nothing is smaller |
| 12.5px | Secondary text and code |
| 14px | Body |
| 16px | Panel and step titles |
| 19px | The task title |

Fonts: **Chakra Petch** (bold, uppercase, tracked) for section tabs, pipeline stages and labels; **Michroma** only for the ORC wordmark and Orc's speaker label; **Inter** for body; **JetBrains Mono** for code, keys, branches, and numbers.

### Shapes

- **Frame:** a 1px outline with chamfered top-left and bottom-right corners (`clip-path`). Large frames use a 26px chamfer, panels 16px, small panels 10px.
- **Section tab:** a trapezoid label on a panel's top edge, solid neutral fill, bold uppercase text.
- **Pipeline:** chevrons. Done is outlined in moss with a check; current is solid (moss, orange when blocked, red on an error); not started is dim; skipped (fast lane) is striped.
- **Navigation buttons** (previous, next, New task) are parallelograms that follow the task switcher's slanted edges.

`clip-path` clips focus outlines, so focusable shapes draw their focus state inside the shape. Check this on every new shaped component.
