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

  /* ---------------- rendering ---------------- */

  function taskCard(task) {
    var st = statusOf(task);
    var done = doneCount(task), total = totalCount(task);
    var pct = total ? Math.round((done / total) * 100) : 0;

    var items = (task.items || []).map(function (item) {
      var parts = splitNotes(item);
      var isDone = st === 'done' ? true : !!item.done;
      return '<li class="' + (isDone ? 'done' : '') + '">' + esc(parts.text) +
        (parts.notes ? '<span class="notes"><b>Notes:</b> ' + esc(parts.notes) + '</span>' : '') +
        '</li>';
    }).join('');

    return '' +
      '<article class="card ' + (st === 'done' ? 'is-done' : st === 'progress' ? 'is-progress' : '') + '" data-status="' + st + '">' +
        '<div class="card-head">' +
          '<h3>' + (st === 'done' ? '✓ ' : '') + esc(task.heading || task.title || 'Untitled task') + '</h3>' +
          '<span class="badge badge-' + st + '">' + LABEL[st] + '</span>' +
        '</div>' +
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
    container.innerHTML = tasks.map(taskCard).join('');
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
          (tasks.length ? tasks.map(taskCard).join('') : '<div class="empty">No tasks recorded for this week.</div>') +
        '</div>' +
      '</details>';
    }).join('');
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
    document.getElementById('updatedChip').textContent =
      'Updated ' + (meta.lastUpdated ? fmtDate(parseDate(meta.lastUpdated)) || meta.lastUpdated : '—');

    var weeks = (data.weeks || []).slice().sort(function (a, b) {
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
