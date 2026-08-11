#!/usr/bin/env python3
"""Regenerate Tasks.md from tasks.json.

tasks.json is the source of truth; Tasks.md is a readable mirror of it. Run this
after any edit to tasks.json:

    python3 scripts/generate_tasks_md.py

Pass --check to verify the mirror is current without writing (exits 1 if stale).

Date handling mirrors app.js: values are plain YYYY-MM-DD or full timestamps, and
every one of them is Pakistan Time (PKT, UTC+05:00) — see AGENT.md.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, 'tasks.json')
TARGET = os.path.join(ROOT, 'Tasks.md')


def stamp(value):
    """Render a date or timestamp for display: '2026-08-05' / '2026-08-05 14:30:00+05:00'."""
    if not value:
        return ''
    return str(value).replace('T', ' ')


def is_done(task):
    """Explicit status wins, else derive from the points — same rule as app.js."""
    status = str(task.get('status', '')).lower().replace('_', '-').replace(' ', '-')
    if status in ('done', 'completed'):
        return True
    if status in ('in-progress', 'progress'):
        return False
    items = task.get('items') or []
    return bool(items) and all(i.get('done') for i in items)


def task_meta_line(task):
    parts = ['Status: **%s**' % (task.get('status') or ('done' if is_done(task) else 'pending'))]
    if task.get('priority'):
        parts.append('Priority: **%s**' % task['priority'])
    if task.get('addedDate'):
        parts.append('Added %s' % stamp(task['addedDate']))
    if task.get('modifiedDate'):
        parts.append('Updated %s' % stamp(task['modifiedDate']))
    if task.get('completedDate'):
        parts.append('Completed %s' % stamp(task['completedDate']))
    return ' · '.join(parts)


def item_trail(item, task):
    """Only dates that add information beyond the parent task, as the web page does."""
    parts = []
    added, modified, completed = (item.get('addedDate'), item.get('modifiedDate'),
                                  item.get('completedDate'))
    if added and added != task.get('addedDate'):
        parts.append('Added %s' % stamp(added))
    if modified and modified != added and modified != task.get('modifiedDate'):
        parts.append('Updated %s' % stamp(modified))
    if completed and completed != task.get('completedDate'):
        parts.append('Completed %s' % stamp(completed))
    return ' · '.join(parts)


def render(data):
    meta = data.get('meta', {})
    out = ['# %s' % meta.get('title', 'Tasks Assignment'), '']
    header = []
    if meta.get('owner'):
        header.append('Owner: **%s**' % meta['owner'])
    if meta.get('timezone'):
        header.append('Timezone: **%s**' % meta['timezone'])
    if meta.get('lastUpdated'):
        header.append('Last updated: **%s**' % meta['lastUpdated'])
    if header:
        out += [' · '.join(header), '']
    out += ['Mirror of `tasks.json` in readable form. `tasks.json` remains the source of truth — '
            'update it first, then regenerate this file with `python3 scripts/generate_tasks_md.py`.',
            '']

    weeks = sorted(data.get('weeks', []),
                   key=lambda w: str(w.get('weekStart')), reverse=True)
    for week in weeks:
        out.append('## Week %s → %s' % (week.get('weekStart'), week.get('weekEnd')))
        out.append('')
        tasks = week.get('tasks') or []
        if not tasks:
            out += ['_No tasks recorded for this week._', '']
            continue
        for position, task in enumerate(tasks, 1):
            index = task.get('index', position)
            out.append('### %s. [%s] %s' % (index, 'x' if is_done(task) else ' ',
                                            task.get('heading', 'Untitled task')))
            out += ['', task_meta_line(task), '']
            if task.get('notes'):
                out += ['_Notes:_ %s' % task['notes'], '']
            if not (task.get('items') or []):
                continue          # heading-only task: the blank line above is enough
            for item in task.get('items'):
                out.append('- [%s] %s' % ('x' if item.get('done') else ' ', item.get('text', '')))
                if item.get('notes'):
                    out.append('  - _Notes:_ %s' % item['notes'])
                trail = item_trail(item, task)
                if trail:
                    out.append('  - _%s_' % trail)
            out.append('')
    return '\n'.join(out).rstrip('\n') + '\n'


def main():
    with open(SOURCE, encoding='utf-8') as fh:
        content = render(json.load(fh))

    if '--check' in sys.argv:
        current = open(TARGET, encoding='utf-8').read() if os.path.exists(TARGET) else ''
        if current != content:
            print('Tasks.md is out of date — run: python3 scripts/generate_tasks_md.py')
            return 1
        print('Tasks.md is up to date.')
        return 0

    with open(TARGET, 'w', encoding='utf-8') as fh:
        fh.write(content)
    print('Wrote %s' % os.path.relpath(TARGET, ROOT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
