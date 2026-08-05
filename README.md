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
          "heading": "Main Heading",
          "status": "pending",          // optional: pending | in-progress | done
          "priority": "normal",         // optional: high | normal (default) | low
          "items": [
            { "text": "Bullet point 1", "done": true,  "notes": "" },
            { "text": "Bullet point 2", "done": false, "notes": "ABC def" }
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
- **Priority** — optional. `high` floats a task to the top of its week with a red edge and a **High**
  badge; `low` sinks it to the bottom, muted grey with a **Low** badge. Anything else keeps the order
  it has in the file and shows no priority badge.
- **Done styling** — done tasks and done bullets render in green with a ✓ tick.
- **Notes** — use the `notes` field, or write them inline as `Bullet point 2 (notes: ABC def)`; both
  render as a highlighted note under the bullet.

## Adding a new week

Prepend a new object to `weeks` with the new Monday/Sunday dates and that week's tasks, then bump
`meta.lastUpdated`. The previous current week automatically becomes "Last Week", and the one before
it slides into history — no page changes needed.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly via `file://` will not work — browsers block `fetch` on that scheme.
