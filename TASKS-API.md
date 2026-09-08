# Task Board API

The tasks in `tasks.json` also live on the owner's deployed site. This document is the contract for
that API, for anyone syncing this repository against it.

> **This is a synced copy, not the source of truth.** `tasks-api.md` in the **WinServerApp** repo
> ships beside the code and is authoritative. If the two disagree, that one is right and this one is
> stale — say so there rather than "fixing" it here. When the contract changes, update this file in
> the same commit as the sync change it forces, so the document and the code that uses it move
> together.
>
> Verified against production at WinServerApp commit `d36a9c6`.

**Base URL:** `https://serverapp.meserver.click`
**Content type:** `application/json` both ways.
**Rate limit:** 60 requests/minute per IP across all `/api/*`. Over it → **429**.
**Dates:** always `yyyy-MM-dd`, Pakistan time, and they are **shift-days, not calendar dates**.
A date field that is not exactly `yyyy-MM-dd` is **rejected with `400 INVALID_TASK` naming the task,
never coerced** — the validator matches `^\d{4}-\d{2}-\d{2}$` and nothing else. **Truncating is the
caller's job**: the `+05:00` timestamps a few older `tasks.json` entries carry must be cut to their
first 10 characters before they are sent. A slip fails loudly rather than storing a mangled date,
which is the good failure — but only if you expect it.

---

## Authentication

Every endpoint needs the token. Either header, equivalent:

```
Authorization: Bearer <token>
X-Task-Token: <token>
```

The token is displayed on `/Tasks`, behind the admin sign-in and the two-factor gate. It **expires an
hour after issue**, is revocable from that page, and **an app-pool restart invalidates it** — so every
deployment kills the live token. Ask the owner for a fresh one; nothing on this side can mint one.

**401** on missing, expired or revoked:

```json
{ "error": "Missing, expired, or revoked task API token.",
  "code": "TASK_TOKEN_INVALID",
  "hint": "Tokens last one hour. Copy the current one from the Tasks page and retry." }
```

Branch on `code`, never the message. A retry with the same value never succeeds.

---

## 1. `GET /api/tasks`

Returns the whole board.

```json
{
  "currentWeek": "2026-09-07",
  "generatedAt": "2026-09-07",
  "weeks": [
    {
      "weekStart": "2026-09-07",
      "weekEnd": "2026-09-13",
      "isCurrent": true,
      "label": "7 - 13 Sep 2026",
      "doneCount": 1,
      "totalCount": 2,
      "tasks": [
        {
          "id": "zone-management-portal",
          "index": 1,
          "heading": "Zone Management",
          "status": "in-progress",
          "statusDerived": true,
          "priority": "high",
          "notes": "…",
          "link": "https://…",
          "linkLabel": "TICKET-12",
          "addedDate": "2026-08-11",
          "modifiedDate": "2026-08-20",
          "completedDate": null,
          "doneCount": 1,
          "totalCount": 2,
          "items": [
            { "id": 412,
              "text": "Draft the schema",
              "done": true,
              "notes": null,
              "image": null,
              "imageAlt": null,
              "addedDate": "2026-08-11",
              "modifiedDate": "2026-08-20",
              "completedDate": "2026-08-20" }
          ]
        }
      ]
    }
  ],
  "deletedTasks": [
    { "id": "ch-taxi-fare", "heading": "CH taxi fare",
      "weekStart": "2026-08-31", "deletedDate": "2026-09-08" }
  ]
}
```

Weeks newest first. Tasks within a week in render order: high priority first, low last, stable on
`index` inside each band.

### Fields that are the API's, not `tasks.json`'s — drop them when writing this repo

| Field | Meaning |
| --- | --- |
| `items[].id` | Stable, server-minted point id. Never reused. |
| `statusDerived` | `true` = `status` was computed from the points; `false` = a stored override. When `true` write **no** `status` key to `tasks.json`; when `false` write the value. |
| `doneCount`, `totalCount`, `label`, `isCurrent` | Render conveniences. |

Everything else matches `tasks.json` field for field. This repo may hold a **richer** value than the
wire carries: dates here can include a `+05:00` timestamp (§3 of `AGENT.md`), truncated to
`yyyy-MM-dd` by this side on the way out. That difference is expected rather than drift, and the
asymmetry runs one way only — the API never returns a value needing widening, so a round trip
loses time-of-day precision but never anything else.

---

## 2. `POST /api/tasks`

Creates or updates tasks. Always the envelope, a single-task update included.
**Max 200 tasks per request.**

```json
{ "tasks": [
    { "id": "zone-management-portal",
      "weekStart": "2026-09-07",
      "heading": "Zone Management",
      "status": "in-progress",
      "priority": "high",
      "notes": "…",
      "link": "https://…",
      "linkLabel": "TICKET-12",
      "addedDate": "2026-08-11",
      "modifiedDate": "2026-08-20",
      "completedDate": null,
      "allowPointDeletion": false,
      "items": [
        { "id": 412, "text": "Draft the schema", "done": true,
          "notes": null, "image": null, "imageAlt": null,
          "addedDate": "2026-08-11", "modifiedDate": "2026-08-20",
          "completedDate": "2026-08-20" }
      ] } ] }
```

**200:**

```json
{ "applied": [ { "id": "zone-management-portal", "created": false, "restored": false } ],
  "currentWeek": "2026-09-07",
  "weeks": [ … ],
  "deletedTasks": [ … ] }
```

The response carries the full board, so push-then-read is one round trip.

### Upsert rules

- Keyed on **`id`**. Present → update; absent → create. `heading` required on create.
- **`id` is shared verbatim between the two stores.** No mapping table.
  `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤120 chars, never renamed. Tasks created on the page mint theirs from
  the heading (`Zone Management` → `zone-management`, `-2`/`-3` on collision).
- **Absent ≠ null.** Omitted → left alone. Sent as `null` → cleared. Matters most for `status`:
  `null` drops the override and hands the status back to the points.
- **`weekStart` normalises to its Monday.** `weekEnd` is derived — send it only if it agrees, or 400.
- **`index`** is stored data, 1-based within the week. Omit on create → next free one.
- **`addedDate` is write-once.** Supply it **on create** to preserve an imported date; an update never
  moves it.
- **`modifiedDate` is stored verbatim when supplied**, stamped with today only when omitted.
- **`completedDate`**: set when something completes, nulled when it stops being complete. An existing
  value is never overwritten. An explicit value beats what a `done` flip would write.
- `status`: `pending` | `in-progress` | `done`, or `null` to derive.
  `priority`: `high` | `normal` | `low`, or `null`.

### `items` — the two matching modes

`items` is the **authoritative list**: what you send becomes the task's points, in the order sent, and
a stored point you don't list is removed (subject to the guard below). **Omit `items` entirely to
update task fields and leave points untouched** — the safest shape when points aren't the subject.

**Positional mode** — no entry carries an `id`. Index 0 ↔ ordinal 0. The original contract, and what
this repo uses today, since item ids are not persisted here.

**Id mode** — any entry carries an `id`, so the whole array is id-matched:

- the **array's order becomes the new order** — a reorder is just a list of ids;
- entry **with** an `id` edits that point, omitted fields left alone;
- entry **without** an `id` is a **new point** created where it appears;
- an id belonging to another task, or repeated in one array → **400**.

Reorder, nothing else resent:

```json
{ "tasks": [ { "id": "some-task", "items": [ {"id": 414}, {"id": 412}, {"id": 413} ] } ] }
```

Mixing is allowed and is sometimes right — a point hand-added to `tasks.json` with no id lands as a
new point in position. Just never omit an id on an entry meant to *update*, or you get a duplicate.

### The point-deletion guard

An `items` array that **would remove any stored point** is rejected unless that task sets
`"allowPointDeletion": true`.

```json
{ "error": "This items array would remove 1 stored point from task 'x'. Re-read the task and merge before pushing, or send allowPointDeletion: true if the removal is intended.",
  "code": "POINT_DELETION_NOT_ALLOWED", "id": "x", "applied": [] }
```

- Flag is **per task**, so one task in a batch can shrink while the rest stay guarded.
- Checked against **what would actually be removed**, not array length — a same-length array swapping
  a stored point for a new one is caught too.
- A task with no stored points can't lose any; a first push is never blocked. A request omitting
  `items` never trips it.
- **Branch on this code by re-reading and merging, not by retrying with the flag set.** The rejection
  means this repo's copy is probably stale, and flagging past it deletes the very work the guard
  caught. Set the flag only where the owner has actually named a point for removal.
- It catches **dropped points, not stale content.** A same-count push carrying stale text still
  overwrites silently. GET-and-merge is the real protection.

---

## 3. `DELETE /api/tasks/{id}`

Soft-deletes a task. It leaves `weeks` and every count, and appears in `deletedTasks` from then on.

```json
{ "deleted": "ch-taxi-fare", "deletedDate": "2026-09-08",
  "currentWeek": "2026-09-07", "weeks": [ … ], "deletedTasks": [ … ] }
```

**404** `TASK_NOT_FOUND` if the id is unknown or already deleted.

## 4. `DELETE /api/tasks/{id}/points/{pointId}`

Removes one point outright, without resending the others. Hard — points have no tombstone.

```json
{ "deleted": 412, "task": { "…the task as GET renders it…": null },
  "currentWeek": "2026-09-07", "weeks": [ … ] }
```

**404** `POINT_NOT_FOUND`. Needs no `allowPointDeletion`; it is already an explicit statement of intent.

---

## Shift days

The owner's working day runs **13:00 → 07:00 next morning**, so every date the server stamps is a
shift-day, not a calendar date.

| Pakistan time | Stamped |
| --- | --- |
| 8 Sep 00:30 | `2026-09-07` |
| 8 Sep 06:59 | `2026-09-07` |
| 8 Sep 07:00 | `2026-09-08` |
| 8 Sep 23:59 | `2026-09-08` |

Configured as `Tasks:ShiftDayStartHour` (default `7`; `0` gives calendar dates). Applied to
`addedDate`, `modifiedDate`, done-flip `completedDate` and `deletedDate` — and **before** a date is
snapped to its Monday, so 02:00 Monday work belongs to the week that is ending.

Dates stamped before this shipped are calendar dates and were deliberately left alone. The same rule
applies to dates written by hand into `tasks.json`.

## Tombstones

Permanent — nothing prunes them and no task row is ever hard-deleted. So **absent from `weeks` and
not in `deletedTasks` is an error, not a deletion.**

> **The resurrection trap.** An upsert of a tombstoned `id` **restores** the task and reports
> `"restored": true`. Deliberate — a re-add has to work — but it means pushing a task deleted on the
> site brings it back. **Process `deletedTasks` before every push.**

## Error codes

| Code | HTTP | Meaning |
| --- | --- | --- |
| `TASK_TOKEN_INVALID` | 401 | Missing, expired or revoked token. Get a fresh one. |
| `EMPTY_REQUEST` | 400 | No tasks in the envelope. |
| `TOO_MANY_TASKS` | 400 | More than 200 tasks. |
| `INVALID_TASK` | 400 | A task failed validation. `id` names it. |
| `POINT_DELETION_NOT_ALLOWED` | 400 | Re-read and merge. |
| `TASK_NOT_FOUND` | 404 | Unknown or already-deleted task. |
| `POINT_NOT_FOUND` | 404 | Unknown point. |
| — | 429 | Rate limit. |

A batch **stops at the first offender**; `applied` lists what landed before it, and those writes
stand. Fix the named task and resend from there rather than replaying the batch.

---

## Sync order

The order is the point — steps 1 and 2 cannot be swapped without resurrecting deleted work.

1. `GET /api/tasks`.
2. Process `deletedTasks` — mirror removals into `tasks.json` **before** anything else.
3. Merge site-side changes into `tasks.json`.
4. Push, `modifiedDate` explicit on every task, `allowPointDeletion` only where a removal was actually
   asked for.
5. Regenerate `Tasks.md`, then commit `tasks.json` and this document together when the contract moved.

## Verified behaviour

Observed against production on 2026-09-08, all matching this document:

- A 34-task batch of `id` + `modifiedDate` only: 34 applied, 0 created, points untouched, dates stored
  verbatim rather than stamped.
- A deliberately stale push (3 stored points, 2 sent, no flag): `400 POINT_DELETION_NOT_ALLOWED`
  naming the task, `applied: []`, and **nothing written** — the task still had 3 points afterwards.
- At 04:22 PKT on 8 Sep, `currentWeek` and `generatedAt` both returned `2026-09-07`.
- `deletedTasks` present as `[]`; `items[].id` present on all 91 points.

Also confirmed on this side: every date leaving this repo is truncated to its first 10 characters
before it is sent, so the two `+05:00` entries in `tasks.json` cannot trip the `yyyy-MM-dd`
validator.

**Not yet exercised against production by either side:** task deletion and the tombstone mirror, and
the `allowPointDeletion: true` success path. Both were skipped deliberately — testing them means
destroying or littering real data. Watch the first real deletion closely.
