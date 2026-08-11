# Tasks Assignment

A single-page task board hosted on GitHub Pages. It shows **this week's tasks** (pending and done),
**last week's tasks** below them, and the **full history** of every past week — all read from
[`tasks.json`](tasks.json), which is the single source of truth for all-time task history.

## Files

| File | Purpose |
| --- | --- |
| `tasks.json` | All task data, all time. The only file you edit day to day. |
| `index.html` | Page structure |
| `styles.css` | Light theme, rich colors |
| `app.js` | Loads `tasks.json` and renders the board |
| `Tasks.md` | Readable Markdown mirror — generated, don't edit by hand |
| `scripts/generate_tasks_md.py` | Regenerates `Tasks.md` from `tasks.json` |

## Enabling GitHub Pages

Repository → **Settings** → **Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)`.
The site will be published at `https://<user>.github.io/PublicTasksView/`.

## `tasks.json` format

```jsonc
{
  "meta": {
    "title": "Tasks Assignment",
    "owner": "ihihamst",
    "weekStartsOn": "monday",
    "lastUpdated": "2026-08-05"
  },
  "weeks": [
    {
      "weekStart": "2026-08-03",        // Monday, YYYY-MM-DD
      "weekEnd":   "2026-08-09",        // Sunday, YYYY-MM-DD
      "tasks": [
        {
          "id": "short-slug",
          "index": 1,                   // weekly index, 1..n across the whole week
          "heading": "Main Heading",
          "status": "pending",          // optional: pending | in-progress | done
          "priority": "normal",         // optional: high | normal (default) | low
          "addedDate": "2026-08-03",
          "modifiedDate": "2026-08-05",
          "completedDate": null,        // null until finished
          "items": [
            {
              "text": "Bullet point 1",
              "done": true,
              "notes": "",
              "addedDate": "2026-08-03",
              "modifiedDate": "2026-08-05",
              "completedDate": "2026-08-05"
            },
            {
              "text": "Bullet point 2",
              "done": false,
              "notes": "ABC def",
              "addedDate": "2026-08-03",
              "modifiedDate": "2026-08-03",
              "completedDate": null
            }
          ]
        }
      ]
    }
  ]
}
```

### Rules the page applies

- **Which week is "current"** — the week whose `weekStart`–`weekEnd` range contains today. If no week
  matches (e.g. the file hasn't been updated yet), the newest week is shown as current.
- **Last week** — the next-newest week after the current one. Everything older falls into *Task History*.
- **Status** — an explicit `"status"` wins. Otherwise it is derived from the bullets: all bullets
  `done` → **Done**, some → **In Progress**, none → **Pending**.
- **Index** — each task shows a numbered badge. Numbering is **per week** and covers **every** task in
  that week, pending and completed alike, so the numbers stay 1..n. It comes from the `index` field;
  if you leave it out, the task's position in the week's `tasks` array is used instead. Because it is
  data rather than display order, the number does not change when cards are re-sorted by priority,
  filtered, or hidden by the completed-points toggle.
- **Link** — optional `link` (plus `linkLabel`) puts a clickable chip on the card, for a ticket or
  tracker URL. Only `http`/`https` links render.
- **Priority** — optional. `high` floats a task to the top of its week with a red edge and a **High**
  badge; `low` sinks it to the bottom, muted grey with a **Low** badge. Anything else keeps the order
  it has in the file and shows no priority badge.
- **Done styling** — done tasks and done bullets render in green with a ✓ tick.
- **Notes** — use the `notes` field, or write them inline as `Bullet point 2 (notes: ABC def)`; both
  render as a highlighted note under the bullet. A task can also carry its own `notes`, which renders
  under the heading and applies to the whole task.
- **Timezone** — **all dates and times in this repo are Pakistan Time (PKT, UTC+05:00)**, declared in
  `meta.timezone` and shown in the footer. Write either a plain date (`"2026-08-05"`) or a full
  timestamp with the offset (`"2026-08-05T15:00:00+05:00"`); timestamps render as `Aug 5, 3:00 PM PKT`
  and stay PKT even for a reader in another country.
- **Dates** — every task *and* every bullet carries `addedDate`, `modifiedDate` and `completedDate`
  (date or timestamp, or `null` for a completion that hasn't happened). They render as a small grey trail
  under the heading/bullet. A bullet's date is hidden when it just repeats its task's date, so only
  genuinely new information shows. Set `addedDate` once, bump `modifiedDate` on every edit (both on
  the bullet and its parent task), and fill `completedDate` when something is marked done.

### Header controls

- **Show completed points** — a checkbox in the top header. Unchecking it hides every completed bullet
  and any fully completed task, leaving only outstanding work on screen. The choice is remembered in
  the browser. Clicking the **Done** filter turns it back on, since otherwise there'd be nothing to see.

## Adding a new week

Prepend a new object to `weeks` with the new Monday/Sunday dates and that week's tasks, then bump
`meta.lastUpdated`. The previous current week automatically becomes "Last Week", and the one before
it slides into history — no page changes needed.

## Keeping `Tasks.md` in sync

`Tasks.md` is a generated mirror of `tasks.json` for reading on GitHub. After editing tasks, run:

```bash
python3 scripts/generate_tasks_md.py          # rewrite Tasks.md
python3 scripts/generate_tasks_md.py --check  # verify it's current (exit 1 if stale)
```

Never edit `Tasks.md` by hand — the next regeneration overwrites it.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly via `file://` will not work — browsers block `fetch` on that scheme.
