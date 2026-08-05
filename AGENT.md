# AGENT.md

Working notes for any agent (or person) editing this repository. Read this before changing anything.

---

## 1. What this repository is

A **static, single-page weekly task board** published with GitHub Pages at
<https://ihihamst.github.io/PublicTasksView/>. It is a personal page for one owner (`ihihamst`).

All task content lives in **`tasks.json`**, which is the all-time history — every week ever recorded.
The page reads that file at runtime and renders three sections: the current week, last week, and a
collapsible archive of every older week.

There is **no build step, no framework, no dependencies, no backend.** Three static files plus a JSON
file. Do not introduce a bundler, npm package, or CSS framework — the whole point is that the owner
can edit `tasks.json` in the GitHub web editor and see the result a minute later.

---

## 2. Files

| File | Role | Edit frequency |
| --- | --- | --- |
| `tasks.json` | **The data.** All tasks, all weeks, all time. | Every task update |
| `index.html` | Page skeleton: header, stats strip, three sections, footer. | Rarely |
| `styles.css` | Light theme, rich colors, deliberately dense spacing. | Rarely |
| `app.js` | Fetches `tasks.json`, derives status, sorts, renders, wires controls. | Rarely |
| `README.md` | Owner-facing docs: schema, how to add a week. | When schema changes |
| `AGENT.md` | This file. | When conventions change |

---

## 3. `tasks.json` schema

```jsonc
{
  "meta": {
    "title": "Tasks Assignment",       // page <title> and header text
    "owner": "ihihamst",               // shown in the header subtitle
    "weekStartsOn": "monday",          // documentation only; not read by the code
    "lastUpdated": "2026-08-05"        // shown as the "Updated …" chip — bump on every edit
  },
  "weeks": [                           // any order; the page sorts by weekStart descending
    {
      "weekStart": "2026-08-03",       // Monday,  YYYY-MM-DD
      "weekEnd":   "2026-08-09",       // Sunday,  YYYY-MM-DD
      "label": "Current Week",         // optional, cosmetic, unused by the renderer
      "tasks": [
        {
          "id": "ch-taxi-fare",        // stable kebab-case slug, unique within the file
          "heading": "Main Heading",   // the task title
          "status": "pending",         // optional: pending | in-progress | done
          "priority": "low",           // optional: high | normal (default) | low
          "addedDate":     "2026-08-03",
          "modifiedDate":  "2026-08-05",
          "completedDate": null,       // null until every point is finished
          "items": [
            {
              "text": "Bullet point 1",
              "done": true,
              "notes": "Fix: root cause was …",   // optional, "" when empty
              "addedDate":     "2026-08-03",
              "modifiedDate":  "2026-08-05",
              "completedDate": "2026-08-05"       // null while not done
            }
          ]
        }
      ]
    }
  ]
}
```

### Date fields (required on every task **and** every point)

| Field | Meaning | Rule |
| --- | --- | --- |
| `addedDate` | when the task/point first appeared | set once, **never** changed afterwards |
| `modifiedDate` | last time its text, notes, or done state changed | bump on **every** edit to that object |
| `completedDate` | the day it was finished | set when `done` flips to `true`; `null` otherwise |

All dates are plain `YYYY-MM-DD` strings (no times, no timezones — the renderer parses them as local
dates, so a bare `new Date("2026-08-03")` UTC-shift bug is avoided).

Propagation rules an editor must follow:

- Editing a **point** → bump that point's `modifiedDate` **and** its parent task's `modifiedDate`.
- Marking a point done → set its `completedDate`, bump both `modifiedDate`s.
- When the **last** point of a task becomes done → set the task's `completedDate` too.
- Un-completing something → set its `completedDate` back to `null`.
- Any edit anywhere → bump `meta.lastUpdated`.

---

## 4. Behavior the renderer derives (`app.js`)

Nothing below is stored in the JSON; it is all computed at render time.

- **Which week is "current"** — the week whose `weekStart`–`weekEnd` range contains today. If no
  week matches (the file is stale), the newest week is shown as current instead of showing nothing.
- **Last week** — the next-newest week after the current one. Everything older goes to *Task History*.
- **Status** — an explicit `"status"` wins. Otherwise it is derived from the points: all `done` →
  `done`, some → `progress`, none → `pending`. `statusOf()` is the single source of truth; do not
  re-derive status inline anywhere else.
- **Priority ordering** — `byPriority()` is a *stable* sort: `high` floats up, `low` sinks, and equal
  priorities keep their file order. Applied to the current week, last week, and history alike.
- **Date trail** — `dateTrail(obj, parent)` renders "Added … · Updated … · Completed …", dropping any
  part that repeats its parent task's date. This is what keeps a task's bullets from each echoing the
  same "Added Aug 3". Keep that suppression when touching this function; without it the page roughly
  doubles in height.
- **Notes** — read from the `notes` field, or parsed out of a trailing `(notes: …)` in the point text
  by `splitNotes()`. Both render as the same highlighted callout.

### Controls

- **Show completed points** — a header checkbox. Unchecked adds `body.hide-completed`, whose CSS hides
  completed bullets (`.items li.done`) and fully completed task cards (`.card.is-done`). The choice
  persists in `localStorage` under `tasksview:showCompleted`. Clicking the **Done** filter while it is
  unchecked would show an empty list, so the filter re-checks it automatically — preserve that.
- **All / Pending / Done filters** — toggle inline `display` on current-week cards only. `Pending`
  deliberately also shows `in-progress` cards, since those still have outstanding work.

---

## 5. Design constraints

- **Single light theme with rich colors.** No dark mode. Palette lives in the `:root` block of
  `styles.css` — indigo/violet for structure, green for done, amber for pending, rose for high priority,
  slate for low priority.
- **Full-bleed and dense.** `.wrap` has no `max-width` and only 10px side padding — the owner asked for
  no left/right margins and very tight spacing. Do not reintroduce a centered fixed-width column, and
  do not "improve" readability by adding padding back.
- **Done styling is non-negotiable**: completed tasks and points render green with a ✓ tick replacing
  the point number.
- Everything must survive being served as plain static files from a subpath (`/PublicTasksView/`), so
  all asset references stay relative.

---

## 6. Editing workflow

Adding a task, a point, or marking something done is a **`tasks.json` edit only** — no code changes.

Adding a new week: prepend an object to `weeks` with the new Monday/Sunday dates. The previous current
week becomes "Last Week" automatically and the one before it slides into history.

### Conventions

- User-supplied task text is copied **verbatim**; fix only obvious casing/typos (e.g. `polygones` →
  `polygons`) and never reword the substance or invent scope that was not asked for.
- Never invent history. If a past week's data is unknown, leave it out rather than fabricating tasks or
  dates.
- `id` values are stable — history and any future linking depend on them. Do not renumber or rename.

### Verifying a change

```bash
python3 -c "import json;json.load(open('tasks.json'));print('json ok')"   # always run this
python3 -m http.server 8000                                              # then open localhost:8000
```

`file://` will not work — `fetch` is blocked on that scheme, and `app.js` shows an explicit error
message saying so.

### Git

Development happens on `claude/tasks-assignment-project-8ug1t9`; the owner has asked for changes to be
merged into `main` (fast-forward) and pushed, since GitHub Pages serves from `main`. Pages redeploys in
under a minute; a stale-looking page is usually browser cache (Ctrl+Shift+R).

---

## 7. Known gaps / deliberate non-goals

- **No per-task links, owners, or estimates** — not requested; do not add speculatively.
- **No dark mode, no theme switcher.**
- **Dates are entered by hand.** There is no automation that stamps `modifiedDate`; an editing agent is
  responsible for the propagation rules in §3. If that ever becomes error-prone, the right fix is a
  small pre-commit script that diffs `tasks.json` and stamps dates — not a runtime change to `app.js`.
- **`meta.weekStartsOn` is documentation only.** The code keys off the explicit `weekStart`/`weekEnd`
  values on each week, so changing it alone changes nothing.
