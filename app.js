/* Tasks Assignment — renders tasks.json into the weekly board. */
(function () {
  'use strict';

  var DATA_URL = 'tasks.json';

  /* ---------------- helpers ---------------- */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function fmtDate(d) {
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* Every timestamp in this repository is Pakistan Time (PKT, UTC+05:00), and is displayed
     as PKT regardless of where the page is being viewed from. */
  var PKT_OFFSET_MIN = 5 * 60;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**
   * Accepts "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM[:SS][±HH:MM|Z]" and returns the wall-clock
   * parts in PKT. A bare date has no time; a time without an offset is read as PKT already.
   */
  function parseStamp(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?\s*(Z|[+-]\d{2}:?\d{2})?$/
      .exec(String(s == null ? '' : s).trim());
    if (!m) return null;
    if (m[4] === undefined) {
      return { y: +m[1], mo: +m[2], d: +m[3], hasTime: false };
    }
    var utcMs = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    var off = m[7];
    if (off && off !== 'Z') {
      var sign = off.charAt(0) === '-' ? -1 : 1;
      utcMs -= sign * (parseInt(off.substr(1, 2), 10) * 60 + parseInt(off.slice(-2), 10)) * 60000;
    } else if (!off) {
      utcMs -= PKT_OFFSET_MIN * 60000;   // no offset given: the value was already PKT wall time
    }
    var p = new Date(utcMs + PKT_OFFSET_MIN * 60000);
    return {
      y: p.getUTCFullYear(), mo: p.getUTCMonth() + 1, d: p.getUTCDate(),
      h: p.getUTCHours(), mi: p.getUTCMinutes(), hasTime: true
    };
  }

  /** Short form for the date trail: "Aug 5", or "Aug 5, 3:00 PM PKT" when a time is recorded. */
  function fmtShort(s) {
    var p = parseStamp(s);
    if (!p) return '';
    var out = MONTHS[p.mo - 1] + ' ' + p.d;
    if (p.y !== new Date().getFullYear()) out += ', ' + p.y;
    if (p.hasTime) {
      var h12 = p.h % 12 === 0 ? 12 : p.h % 12;
      out += ', ' + h12 + ':' + (p.mi < 10 ? '0' : '') + p.mi + ' ' + (p.h < 12 ? 'AM' : 'PM') + ' PKT';
    }
    return out;
  }

  /** Same instant, ignoring any time — used to tell "new information" from "same day". */
  function dayOf(s) {
    var p = parseStamp(s);
    return p ? p.y + '-' + p.mo + '-' + p.d : '';
  }

  /**
   * "Added … · Updated … · Completed …". Each part is dropped when it carries no new
   * information — so a bullet added with its task, and never touched since, shows nothing.
   */
  function dateTrail(obj, parent) {
    var added = fmtShort(obj.addedDate);
    var mod = fmtShort(obj.modifiedDate);
    var comp = fmtShort(obj.completedDate);
    // Suppression compares calendar days, so a timestamp and a bare date on the same day match.
    var day = dayOf, added_ = day(obj.addedDate), mod_ = day(obj.modifiedDate);
    var pAdded = parent ? day(parent.addedDate) : '';
    var pMod = parent ? day(parent.modifiedDate) : '';

    var parts = [];
    if (added && added_ !== pAdded) parts.push('<span>Added <b>' + added + '</b></span>');
    if (mod && mod_ !== added_ && mod_ !== pMod) parts.push('<span>Updated <b>' + mod + '</b></span>');
    var pComp = parent ? fmtShort(parent.completedDate) : '';
    if (comp && comp !== pComp) parts.push('<span class="t-done">Completed <b>' + comp + '</b></span>');
    return parts.length ? '<div class="dates">' + parts.join('') + '</div>' : '';
  }

  function fmtRange(week) {
    var s = parseDate(week.weekStart), e = parseDate(week.weekEnd);
    if (s && e) {
      var sameYear = s.getFullYear() === e.getFullYear();
      var left = s.toLocaleDateString('en-US', sameYear
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' });
      return left + ' – ' + fmtDate(e);
    }
    return week.weekStart || '';
  }

  function today() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  /** Explicit status wins; otherwise derive it from the item checkboxes. */
  function statusOf(task) {
    var items = task.items || [];
    var explicit = String(task.status || '').toLowerCase().replace(/[\s_]+/g, '-');
    if (explicit === 'done' || explicit === 'completed') return 'done';
    if (explicit === 'in-progress' || explicit === 'progress') return 'progress';

    if (!items.length) return explicit === 'pending' ? 'pending' : 'pending';
    var d = items.filter(function (i) { return !!i.done; }).length;
    if (d === items.length) return 'done';
    if (d > 0) return 'progress';
    return 'pending';
  }

  function doneCount(task) {
    var items = task.items || [];
    if (!items.length) return statusOf(task) === 'done' ? 1 : 0;
    return items.filter(function (i) { return !!i.done; }).length;
  }

  function totalCount(task) {
    return (task.items || []).length || 1;
  }

  /** Supports notes written inline as "text (notes: ...)" as well as the notes field. */
  function splitNotes(item) {
    var text = String(item.text || '');
    var notes = String(item.notes || '').trim();
    var m = /\(\s*notes?\s*:\s*([^)]*)\)\s*$/i.exec(text);
    if (m) {
      text = text.slice(0, m.index).trim();
      notes = notes ? notes + ' ' + m[1].trim() : m[1].trim();
    }
    return { text: text, notes: notes };
  }

  var LABEL = { done: 'Done', pending: 'Pending', progress: 'In Progress' };

  /** Renders task.link as a chip. Only http(s) is allowed — no javascript: or data: URLs. */
  function taskLink(task) {
    var url = String(task.link || '').trim();
    if (!/^https?:\/\//i.test(url)) return '';
    var label = task.linkLabel || url.replace(/^https?:\/\//i, '').split('/')[0];
    return '<a class="task-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      '↗ ' + esc(label) + '</a>';
  }

  var PRIO_LABEL = { high: 'High', low: 'Low' };
  var PRIO_RANK = { high: 0, normal: 1, low: 2 };

  function priorityOf(task) {
    var p = String(task.priority || 'normal').toLowerCase();
    return PRIO_RANK.hasOwnProperty(p) ? p : 'normal';
  }

  /**
   * Weekly index: 1..n across every task in the week, pending and completed alike.
   * Explicit "index" values in the file win; anything missing falls back to file order,
   * so the number stays fixed no matter how the cards are sorted or filtered on screen.
   */
  function indexWeek(week) {
    (week.tasks || []).forEach(function (t, i) {
      if (t.index === undefined || t.index === null || t.index === '') t.index = i + 1;
    });
    return week;
  }

  /** Keeps the given order, but floats high priority up and sinks low priority down. */
  function byPriority(tasks) {
    return (tasks || []).map(function (t, i) { return { t: t, i: i }; })
      .sort(function (a, b) {
        var d = PRIO_RANK[priorityOf(a.t)] - PRIO_RANK[priorityOf(b.t)];
        return d !== 0 ? d : a.i - b.i;
      })
      .map(function (x) { return x.t; });
  }

  /* ---------------- rendering ---------------- */

  function taskCard(task) {
    var st = statusOf(task);
    var prio = priorityOf(task);
    var done = doneCount(task), total = totalCount(task);
    var pct = total ? Math.round((done / total) * 100) : 0;

    // Numbers come from the data, not a CSS counter: hiding completed points must not renumber the rest.
    var items = (task.items || []).map(function (item, i) {
      var parts = splitNotes(item);
      var isDone = st === 'done' ? true : !!item.done;
      return '<li class="' + (isDone ? 'done' : '') + '" data-n="' + (i + 1) + '.">' + esc(parts.text) +
        (parts.notes ? '<span class="notes"><b>Notes:</b> ' + esc(parts.notes) + '</span>' : '') +
        dateTrail(item, task) +
        '</li>';
    }).join('');

    return '' +
      '<article class="card ' + (st === 'done' ? 'is-done' : st === 'progress' ? 'is-progress' : '') +
        (prio === 'low' ? ' is-low' : prio === 'high' ? ' is-high' : '') +
        '" data-status="' + st + '" data-priority="' + prio + '">' +
        '<div class="card-head">' +
          '<h3><span class="idx">' + esc(task.index) + '</span>' +
            (st === 'done' ? '✓ ' : '') + esc(task.heading || task.title || 'Untitled task') + '</h3>' +
          taskLink(task) +
          (PRIO_LABEL[prio] ? '<span class="badge badge-prio-' + prio + '">' + PRIO_LABEL[prio] + '</span>' : '') +
          '<span class="badge badge-' + st + '">' + LABEL[st] + '</span>' +
        '</div>' +
        dateTrail(task) +
        (task.notes ? '<span class="notes task-notes"><b>Notes:</b> ' + esc(task.notes) + '</span>' : '') +
        (items ? '<ol class="items">' + items + '</ol>' : '') +
        ((task.items || []).length > 1
          ? '<div class="progress-mini"><div class="bar"><span style="width:' + pct + '%"></span></div>' +
            '<span class="count">' + done + '/' + total + '</span></div>'
          : '') +
      '</article>';
  }

  function renderTasks(container, tasks, emptyMsg) {
    if (!tasks || !tasks.length) {
      container.innerHTML = '<div class="empty">' + esc(emptyMsg) + '</div>';
      return;
    }
    container.innerHTML = byPriority(tasks).map(taskCard).join('');
  }

  function renderStats(tasks) {
    var el = document.getElementById('stats');
    var all = tasks || [];
    var done = all.filter(function (t) { return statusOf(t) === 'done'; }).length;
    var prog = all.filter(function (t) { return statusOf(t) === 'progress'; }).length;
    var pend = all.length - done - prog;
    var pct = all.length ? Math.round((done / all.length) * 100) : 0;

    el.innerHTML =
      stat('Total Tasks', all.length, '') +
      stat('Done', done, 's-done') +
      stat('In Progress', prog, 's-progress') +
      stat('Pending', pend, 's-pending') +
      '<div class="stat"><div class="stat-label">Completion</div>' +
        '<div class="stat-value">' + pct + '%</div>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div></div>';
  }

  function stat(label, value, cls) {
    return '<div class="stat ' + cls + '"><div class="stat-label">' + esc(label) + '</div>' +
      '<div class="stat-value">' + value + '</div></div>';
  }

  function renderHistory(weeks) {
    var el = document.getElementById('history');
    document.getElementById('historyCount').textContent =
      weeks.length + (weeks.length === 1 ? ' week' : ' weeks');

    if (!weeks.length) {
      el.innerHTML = '<div class="empty">No older weeks recorded yet. Past weeks move here automatically as new weeks are added to <code>tasks.json</code>.</div>';
      return;
    }

    el.innerHTML = weeks.map(function (w) {
      var tasks = w.tasks || [];
      var done = tasks.filter(function (t) { return statusOf(t) === 'done'; }).length;
      var allDone = tasks.length > 0 && done === tasks.length;
      return '<details class="week">' +
        '<summary>' + esc(fmtRange(w)) +
          '<span class="pill' + (allDone ? ' all-done' : '') + '">' + done + '/' + tasks.length + ' done</span>' +
        '</summary>' +
        '<div class="week-body">' +
          (tasks.length ? byPriority(tasks).map(taskCard).join('') : '<div class="empty">No tasks recorded for this week.</div>') +
        '</div>' +
      '</details>';
    }).join('');
  }

  var STORE_KEY = 'tasksview:showCompleted';

  function applyShowCompleted(show) {
    document.body.classList.toggle('hide-completed', !show);
    try { localStorage.setItem(STORE_KEY, show ? '1' : '0'); } catch (e) { /* private mode */ }
  }

  function wireCompletedToggle() {
    var box = document.getElementById('toggleCompleted');
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
    if (saved !== null) box.checked = saved === '1';
    applyShowCompleted(box.checked);
    box.addEventListener('change', function () { applyShowCompleted(box.checked); });
  }

  function wireFilters() {
    var buttons = [].slice.call(document.querySelectorAll('.filter'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        var f = btn.dataset.filter;
        // Asking for Done while completed work is hidden would show nothing — reveal it.
        if (f === 'done') {
          var box = document.getElementById('toggleCompleted');
          if (!box.checked) { box.checked = true; applyShowCompleted(true); }
        }
        [].slice.call(document.querySelectorAll('#currentTasks .card')).forEach(function (card) {
          var st = card.dataset.status;
          // "pending" also surfaces partially-complete work.
          var show = f === 'all' || st === f || (f === 'pending' && st === 'progress');
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- boot ---------------- */

  function render(data) {
    var meta = data.meta || {};
    if (meta.title) {
      document.getElementById('siteTitle').textContent = meta.title;
      document.title = meta.title;
    }
    if (meta.owner) document.getElementById('siteSub').textContent = 'Weekly task board · ' + meta.owner;
    if (meta.timezone) document.getElementById('tzNote').textContent = meta.timezone;
    document.getElementById('updatedChip').textContent =
      'Updated ' + (meta.lastUpdated ? fmtDate(parseDate(meta.lastUpdated)) || meta.lastUpdated : '—');

    var weeks = (data.weeks || []).map(indexWeek).sort(function (a, b) {
      return String(b.weekStart).localeCompare(String(a.weekStart));
    });

    if (!weeks.length) {
      document.getElementById('stats').innerHTML = '';
      renderTasks(document.getElementById('currentTasks'), [], 'No tasks in tasks.json yet.');
      renderTasks(document.getElementById('lastTasks'), [], 'No previous week recorded.');
      renderHistory([]);
      return;
    }

    // The current week is the one containing today; otherwise fall back to the newest.
    var now = today();
    var idx = weeks.findIndex(function (w) {
      var s = parseDate(w.weekStart), e = parseDate(w.weekEnd);
      return s && e && now >= s && now <= e;
    });
    if (idx < 0) idx = 0;

    var current = weeks[idx];
    var last = weeks[idx + 1] || null;
    var history = weeks.filter(function (w, i) { return i !== idx && w !== last; });

    document.getElementById('weekRangeChip').textContent = fmtRange(current);
    document.getElementById('currentRange').textContent = fmtRange(current);
    document.getElementById('lastRange').textContent = last ? fmtRange(last) : '—';

    renderStats(current.tasks || []);
    renderTasks(document.getElementById('currentTasks'), current.tasks,
      'No tasks recorded for this week.');
    renderTasks(document.getElementById('lastTasks'), last && last.tasks,
      last ? 'No tasks recorded for last week.' : 'No previous week recorded yet.');
    renderHistory(history);
    wireCompletedToggle();
    wireFilters();
  }

  function fail(msg) {
    document.getElementById('currentTasks').innerHTML =
      '<div class="error"><strong>Could not load tasks.json.</strong><br>' + esc(msg) +
      '<br><br>If you are opening this file directly from disk, run a local server ' +
      '(<code>python3 -m http.server</code>) — browsers block fetch on <code>file://</code>.</div>';
  }

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(render)
    .catch(function (e) { fail(e.message || String(e)); });
})();
