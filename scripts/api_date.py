#!/usr/bin/env python3
"""Convert a tasks.json date value into the `yyyy-MM-dd` the task API accepts.

The API validates dates against `^\\d{4}-\\d{2}-\\d{2}$` and rejects anything else with
400 INVALID_TASK rather than coercing it, so converting is the caller's job. A few entries
in tasks.json carry a full `+05:00` timestamp (AGENT.md §3), and those must be converted
before they are sent.

Naive truncation is wrong. The owner's working day runs 13:00 -> 07:00 the next morning,
so the server stamps *shift-days*, and a timestamp before 07:00 belongs to the previous
calendar date. `"2026-09-08T01:30:00+05:00"` truncates to `2026-09-08` but is shift-day
`2026-09-07` - a value pushed that way disagrees by a day with what the server would have
stamped for the same instant. Every timestamp in the file today is after 07:00, so
truncation and shift-day happen to agree; this helper exists so a late-night one written
later cannot quietly get it wrong.

Use `wire_date()` for anything leaving this repo for the API. See TASKS-API.md.

    python3 scripts/api_date.py          # run the self-test
"""

import re
import sys

SHIFT_DAY_START_HOUR = 7          # mirrors the server's Tasks:ShiftDayStartHour
DATE_ONLY = re.compile(r'^\d{4}-\d{2}-\d{2}$')
# The offset is captured so it can be checked, not ignored: the hour is read as PKT wall
# time, which is only true for +05:00 or a bare time (AGENT.md §3 allows exactly those two).
# A Z value would otherwise be read as if its digits were local and land a day early.
STAMP = re.compile(r'^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):\d{2}(?::\d{2})?\s*(.*)$')
PKT_OFFSETS = ('+05:00', '+0500')   # a bare time is also fine; it is read as PKT wall time

_MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


def _previous_day(y, m, d):
    """Plain civil arithmetic - no datetime, so no timezone can be applied by accident."""
    d -= 1
    if d:
        return y, m, d
    m -= 1
    if not m:
        return y - 1, 12, 31
    days = _MDAYS[m - 1]
    if m == 2 and (y % 4 == 0 and (y % 100 or y % 400 == 0)):
        days = 29
    return y, m, days


def wire_date(value):
    """Return the API-safe `yyyy-MM-dd` for a tasks.json date, or None when empty.

    Date-only values pass through untouched. Timestamps are resolved to their shift-day:
    before 07:00 PKT belongs to the previous calendar date.
    """
    if not value:
        return None
    text = str(value).strip()
    if DATE_ONLY.match(text):
        return text
    m = STAMP.match(text)
    if not m:
        raise ValueError('unrecognised date value: %r' % value)
    offset = m.group(5).strip()
    if offset and offset not in PKT_OFFSETS:
        # No correct answer exists for an offset this helper wasn't designed for, and
        # guessing produces a well-formed wrong date the API will happily store.
        raise ValueError(
            'date %r carries offset %r; only PKT (+05:00) or a bare time is supported. '
            'Convert it to PKT before calling wire_date().' % (value, offset))
    y, mo, d, hour = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    if hour < SHIFT_DAY_START_HOUR:
        y, mo, d = _previous_day(y, mo, d)
    return '%04d-%02d-%02d' % (y, mo, d)


def _selftest():
    cases = [
        (None, None),
        ('', None),
        ('2026-08-03', '2026-08-03'),                     # date-only, untouched
        ('2026-08-05T14:30:00+05:00', '2026-08-05'),      # in tasks.json today
        ('2026-08-10T22:00:00+05:00', '2026-08-10'),      # in tasks.json today
        ('2026-09-08T07:00:00+05:00', '2026-09-08'),      # cutoff itself is the new day
        ('2026-09-08T06:59:00+05:00', '2026-09-07'),      # just under -> previous day
        ('2026-09-08T01:30:00+05:00', '2026-09-07'),      # the case that motivated this
        ('2026-09-01T00:00:00+05:00', '2026-08-31'),      # rolls the month
        ('2026-01-01T03:00:00+05:00', '2025-12-31'),      # rolls the year
        ('2026-03-01T02:00:00+05:00', '2026-02-28'),      # 2026 is not a leap year
        ('2024-03-01T02:00:00+05:00', '2024-02-29'),      # 2024 is
        ('2026-08-05 14:30:00', '2026-08-05'),            # bare time is read as PKT, per AGENT.md
        ('2026-09-08T01:30', '2026-09-07'),               # no seconds, no offset
    ]
    bad = 0
    for given, want in cases:
        got = wire_date(given)
        if got != want:
            bad += 1
            print('FAIL %-30r -> %-12r want %r' % (given, got, want))
    must_raise = [
        '05/08/2026',                   # unparseable
        '2026-09-08T03:00:00Z',         # UTC: digits are not PKT wall time
        '2026-09-08T03:00:00+00:00',    # ditto, spelled out
        '2026-09-08T03:00:00-04:00',    # any other zone
    ]
    for value in must_raise:
        try:
            got = wire_date(value)
        except ValueError:
            continue
        bad += 1
        print('FAIL %-30r should raise, returned %r' % (value, got))
    print('api_date self-test: %d checks, %d failed' % (len(cases) + len(must_raise), bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(_selftest())
