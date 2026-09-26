/* =========================================================
   CSI AITR — Event Management Dashboard
   script.js — data layer + page renderers
   ========================================================= */

const STORAGE_EVENTS = 'csi_events';
const STORAGE_REGISTRATIONS = 'csi_registrations';
const EVENT_DURATION_HOURS = 3; // used to decide when an event flips from "ongoing" to "completed"

/* ---------------------------------------------------------
   Default dummy data (only loaded the first time, i.e. when
   localStorage has nothing saved yet)
   --------------------------------------------------------- */
function buildDefaultEvents(){
  const today = new Date();
  const iso = (daysFromToday) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysFromToday);
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      id: 'evt-1',
      name: 'CSI Web Development Workshop',
      date: iso(6),
      time: '10:00',
      venue: 'CSE Lab 1',
      speaker: 'Ananya Rao',
      capacity: 60,
      description: 'A hands-on workshop covering HTML, CSS and JavaScript fundamentals, ending with every participant deploying a small project of their own.',
      image: ''
    },
    {
      id: 'evt-2',
      name: 'AI & Machine Learning Seminar',
      date: iso(2),
      time: '11:30',
      venue: 'Seminar Hall',
      speaker: 'Dr. Vikram Nair',
      capacity: 120,
      description: 'An introductory seminar on machine learning concepts, real-world applications, and how students can start building their first models.',
      image: ''
    },
    {
      id: 'evt-3',
      name: 'Code Debugging Challenge',
      date: iso(-3),
      time: '14:00',
      venue: 'Computer Lab 2',
      speaker: 'Rohan Mehta',
      capacity: 50,
      description: 'A timed challenge where teams race to spot and fix bugs planted across several small codebases.',
      image: ''
    },
    {
      id: 'evt-4',
      name: 'Git & GitHub Workshop',
      date: iso(-1),
      time: '09:30',
      venue: 'CSE Lab 2',
      speaker: 'Priya Deshmukh',
      capacity: 45,
      description: 'Covers version control basics, branching, pull requests and collaborating on a shared GitHub repository.',
      image: ''
    },
    {
      id: 'evt-5',
      name: 'UI/UX Design Session',
      date: iso(10),
      time: '13:00',
      venue: 'Innovation Lab',
      speaker: 'Sana Iqbal',
      capacity: 40,
      description: 'A practical session on wireframing, usability heuristics, and building a quick clickable prototype in Figma.',
      image: ''
    },
    {
      id: 'evt-6',
      name: 'Competitive Programming Contest',
      date: iso(15),
      time: '10:00',
      venue: 'Computer Lab 1',
      speaker: 'Arjun Kulkarni',
      capacity: 80,
      description: 'A three-hour rated contest with problems ranging from beginner to advanced difficulty, hosted on a live scoreboard.',
      image: ''
    },
    {
      id: 'evt-7',
      name: 'Tech Talk: The Future of Cloud Computing',
      date: iso(-8),
      time: '15:00',
      venue: 'Auditorium',
      speaker: 'Neha Kapoor',
      capacity: 150,
      description: 'An industry guest talk on cloud infrastructure trends, serverless computing, and career paths in the cloud ecosystem.',
      image: ''
    },
    {
      id: 'evt-8',
      name: 'Hackathon Orientation',
      date: iso(20),
      time: '16:00',
      venue: 'Auditorium',
      speaker: 'Karan Bhatia',
      capacity: 200,
      description: 'Kick-off session for the annual CSI hackathon covering rules, timelines, team formation and judging criteria.',
      image: ''
    },
    {
      id: 'evt-9',
      name: 'Database Design Bootcamp',
      date: iso(0),
      time: computeTimeForOngoing(),
      venue: 'CSE Lab 1',
      speaker: 'Ishaan Verma',
      capacity: 55,
      description: 'A focused bootcamp on entity-relationship modelling, normalization, and writing efficient SQL queries.',
      image: ''
    },
    {
      id: 'evt-10',
      name: 'Resume & Interview Prep Session',
      date: iso(-15),
      time: '11:00',
      venue: 'Seminar Hall',
      speaker: 'Meera Joshi',
      capacity: 90,
      description: 'A career-readiness session covering resume building, common technical interview formats, and mock Q&A rounds.',
      image: ''
    }
  ];
}

// Picks a time a little before "now" so this seed event reliably shows as Ongoing on first load
function computeTimeForOngoing(){
  const d = new Date();
  d.setHours(d.getHours() - 1);
  return d.toTimeString().slice(0, 5);
}

function buildDefaultRegistrations(events){
  const pool = [
    ['Rahul Sharma', 'rahul.sharma@example.com', 'CSE'],
    ['Priya Patel', 'priya.patel@example.com', 'IT'],
    ['Aman Gupta', 'aman.gupta@example.com', 'ECE'],
    ['Sneha Reddy', 'sneha.reddy@example.com', 'CSE'],
    ['Vikas Singh', 'vikas.singh@example.com', 'Mechanical'],
    ['Divya Iyer', 'divya.iyer@example.com', 'IT'],
    ['Karthik Nair', 'karthik.nair@example.com', 'CSE'],
    ['Ritika Jain', 'ritika.jain@example.com', 'Electrical'],
    ['Suresh Kumar', 'suresh.kumar@example.com', 'CSE'],
    ['Anjali Verma', 'anjali.verma@example.com', 'IT'],
    ['Manish Yadav', 'manish.yadav@example.com', 'Civil'],
    ['Pooja Choudhary', 'pooja.choudhary@example.com', 'CSE'],
    ['Nikhil Bansal', 'nikhil.bansal@example.com', 'ECE'],
    ['Kavya Menon', 'kavya.menon@example.com', 'IT'],
    ['Tarun Malhotra', 'tarun.malhotra@example.com', 'CSE']
  ];

  const registrationCounts = {
    'evt-1': 42, 'evt-2': 98, 'evt-3': 31, 'evt-4': 45,
    'evt-5': 18, 'evt-6': 52, 'evt-7': 140, 'evt-8': 76,
    'evt-9': 33, 'evt-10': 60
  };

  const regs = {};
  events.forEach(evt => {
    const count = Math.min(registrationCounts[evt.id] || 10, evt.capacity);
    const list = [];
    for (let i = 0; i < count; i++){
      const base = pool[i % pool.length];
      const suffix = i >= pool.length ? Math.floor(i / pool.length) + 1 : '';
      list.push({
        name: base[0] + (suffix ? ' ' + suffix : ''),
        email: suffix ? base[1].replace('@', suffix + '@') : base[1],
        dept: base[2]
      });
    }
    regs[evt.id] = list;
  });
  return regs;
}

function initData(){
  if (!localStorage.getItem(STORAGE_EVENTS)){
    const events = buildDefaultEvents();
    localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(buildDefaultRegistrations(events)));
  }
  if (!localStorage.getItem(STORAGE_REGISTRATIONS)){
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify({}));
  }
}

/* ---------------------------------------------------------
   Storage helpers
   --------------------------------------------------------- */
function getEvents(){
  return JSON.parse(localStorage.getItem(STORAGE_EVENTS) || '[]');
}
function saveEvents(events){
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}
function getAllRegistrations(){
  return JSON.parse(localStorage.getItem(STORAGE_REGISTRATIONS) || '{}');
}
function getRegistrationsFor(eventId){
  const all = getAllRegistrations();
  return all[eventId] || [];
}
function saveAllRegistrations(all){
  localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(all));
}
function getEventById(id){
  return getEvents().find(e => e.id === id) || null;
}
function deleteEventById(id){
  saveEvents(getEvents().filter(e => e.id !== id));
  const regs = getAllRegistrations();
  delete regs[id];
  saveAllRegistrations(regs);
}
function generateId(){
  return 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/* ---------------------------------------------------------
   Status + progress calculations
   --------------------------------------------------------- */
function getEventDateTime(evt){
  return new Date(`${evt.date}T${evt.time || '00:00'}:00`);
}
function computeStatus(evt){
  const start = getEventDateTime(evt);
  const end = new Date(start.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000);
  const now = new Date();
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'completed';
}
function statusLabel(status){
  return { upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed' }[status] || status;
}
function registrationCountFor(evt){
  return getRegistrationsFor(evt.id).length;
}
function progressPercent(evt){
  if (!evt.capacity || evt.capacity <= 0) return 0;
  const pct = Math.round((registrationCountFor(evt) / evt.capacity) * 100);
  return Math.max(0, Math.min(100, pct));
}

/* ---------------------------------------------------------
   Formatting helpers
   --------------------------------------------------------- */
function formatDateReadable(dateStr){
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTimeReadable(timeStr){
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
function initials(name){
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}
function getQueryParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------------------------------------------------------
   Shared UI chrome: mobile menu, active nav link, toast
   --------------------------------------------------------- */
function wireChrome(){
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (menuBtn && sidebar && backdrop){
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      backdrop.classList.add('open');
    });
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    });
    sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    }));
  }
}

let toastTimer = null;
function showToast(message){
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------------------------------------------------------
   Confirm-delete modal (shared across pages)
   --------------------------------------------------------- */
let pendingDeleteId = null;
function openDeleteModal(eventId, eventName){
  pendingDeleteId = eventId;
  const modal = document.getElementById('deleteModal');
  if (!modal) return;
  modal.querySelector('.delete-target-name').textContent = eventName;
  modal.classList.add('open');
}
function closeDeleteModal(){
  pendingDeleteId = null;
  const modal = document.getElementById('deleteModal');
  if (modal) modal.classList.remove('open');
}
function wireDeleteModal(onDeleted){
  const modal = document.getElementById('deleteModal');
  if (!modal) return;
  modal.querySelector('.cancel-delete').addEventListener('click', closeDeleteModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeDeleteModal(); });
  modal.querySelector('.confirm-delete').addEventListener('click', () => {
    if (pendingDeleteId){
      deleteEventById(pendingDeleteId);
      closeDeleteModal();
      showToast('Event deleted');
      if (typeof onDeleted === 'function') onDeleted();
    }
  });
}

/* =========================================================
   PAGE: Dashboard (index.html)
   ========================================================= */
function renderDashboard(){
  const events = getEvents();
  const withStatus = events.map(e => ({ ...e, status: computeStatus(e) }));

  const totalEvents = events.length;
  const upcoming = withStatus.filter(e => e.status === 'upcoming');
  const ongoing = withStatus.filter(e => e.status === 'ongoing');
  const completed = withStatus.filter(e => e.status === 'completed');
  const totalRegistrations = events.reduce((sum, e) => sum + registrationCountFor(e), 0);

  setText('statTotal', totalEvents);
  setText('statUpcoming', upcoming.length);
  setText('statOngoing', ongoing.length);
  setText('statCompleted', completed.length);
  setText('statRegistrations', totalRegistrations);

  renderPreviewSection('previewUpcoming', sortByDate(upcoming).slice(0, 3), 'No upcoming events yet.');
  renderPreviewSection('previewOngoing', ongoing.slice(0, 3), 'Nothing happening right now.');
  renderPreviewSection('previewCompleted', sortByDate(completed, true).slice(0, 3), 'No completed events yet.');

  wireDeleteModal(renderDashboard);
}

function sortByDate(list, desc){
  return [...list].sort((a, b) => {
    const diff = getEventDateTime(a) - getEventDateTime(b);
    return desc ? -diff : diff;
  });
}

function renderPreviewSection(containerId, list, emptyMsg){
  const el = document.getElementById(containerId);
  if (!el) return;
  if (list.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="big-ico">🗓️</div><p>${emptyMsg}</p></div>`;
    return;
  }
  el.innerHTML = list.map(eventCardHtml).join('');
  attachCardActions(el, renderDashboard);
}

/* =========================================================
   PAGE: Events (events.html)
   ========================================================= */
function renderEventsPage(){
  populateVenueFilter();
  const presetStatus = getQueryParam('status');
  if (presetStatus){
    const statusSelect = document.getElementById('statusFilter');
    if (statusSelect) statusSelect.value = presetStatus;
  }
  applyEventFilters();
  wireDeleteModal(applyEventFilters);

  ['searchInput', 'statusFilter', 'venueFilter', 'dateFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyEventFilters);
  });
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('venueFilter').value = '';
    document.getElementById('dateFilter').value = '';
    applyEventFilters();
  });
}

function populateVenueFilter(){
  const select = document.getElementById('venueFilter');
  if (!select) return;
  const venues = [...new Set(getEvents().map(e => e.venue))].sort();
  select.innerHTML = '<option value="">All venues</option>' +
    venues.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}

function applyEventFilters(){
  const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const status = document.getElementById('statusFilter')?.value || '';
  const venue = document.getElementById('venueFilter')?.value || '';
  const date = document.getElementById('dateFilter')?.value || '';

  let events = getEvents().map(e => ({ ...e, status: computeStatus(e) }));

  if (search){
    events = events.filter(e =>
      e.name.toLowerCase().includes(search) ||
      e.speaker.toLowerCase().includes(search) ||
      e.venue.toLowerCase().includes(search)
    );
  }
  if (status) events = events.filter(e => e.status === status);
  if (venue) events = events.filter(e => e.venue === venue);
  if (date) events = events.filter(e => e.date === date);

  events = sortByDate(events);

  const grid = document.getElementById('eventGrid');
  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = `${events.length} event${events.length === 1 ? '' : 's'} found`;
  if (!grid) return;

  if (events.length === 0){
    grid.innerHTML = `<div class="empty-state"><div class="big-ico">🔍</div><p>No events match your filters. Try clearing them.</p></div>`;
    return;
  }
  grid.innerHTML = events.map(eventCardHtml).join('');
  attachCardActions(grid, applyEventFilters);
}

/* ---------------------------------------------------------
   Shared: event card markup + wiring (used on dashboard + events page)
   --------------------------------------------------------- */
function eventCardHtml(evt){
  const status = evt.status || computeStatus(evt);
  const pct = progressPercent(evt);
  const regCount = registrationCountFor(evt);
  return `
    <article class="event-card" data-id="${evt.id}">
      <div class="event-card-top">
        <h3>${escapeHtml(evt.name)}</h3>
        <span class="status-badge status-${status}">${statusLabel(status)}</span>
      </div>
      <div class="event-meta">
        <div class="row"><span class="ico">📅</span><span>${formatDateReadable(evt.date)} · ${formatTimeReadable(evt.time)}</span></div>
        <div class="row"><span class="ico">📍</span><span>${escapeHtml(evt.venue)}</span></div>
        <div class="row"><span class="ico">🎤</span><span>${escapeHtml(evt.speaker)}</span></div>
      </div>
      <div class="progress-block">
        <div class="progress-labels">
          <span>${regCount} / ${evt.capacity} registered</span>
          <span class="pct mono">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${pct >= 100 ? 'full' : ''}" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="event-card-actions">
        <a class="btn btn-outline btn-sm" href="event-details.html?id=${evt.id}">View</a>
        <a class="btn btn-outline btn-sm btn-icon" href="add-event.html?id=${evt.id}" title="Edit event">✏️</a>
        <button class="btn btn-danger btn-sm btn-icon js-delete" title="Delete event">🗑️</button>
      </div>
    </article>
  `;
}

function attachCardActions(container, onDeleted){
  container.querySelectorAll('.js-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.event-card');
      const id = card.dataset.id;
      const evt = getEventById(id);
      openDeleteModal(id, evt ? evt.name : 'this event');
    });
  });
}

/* =========================================================
   PAGE: Add / Edit event (add-event.html)
   ========================================================= */
function renderAddEventForm(){
  const editId = getQueryParam('id');
  const form = document.getElementById('eventForm');
  const heading = document.getElementById('formHeading');
  const subheading = document.getElementById('formSubheading');
  const submitBtn = document.getElementById('submitBtn');
  let existingImage = '';

  if (editId){
    const evt = getEventById(editId);
    if (evt){
      heading.textContent = 'Edit event';
      subheading.textContent = `Updating “${evt.name}”`;
      submitBtn.textContent = 'Save changes';
      form.name.value = evt.name;
      form.date.value = evt.date;
      form.time.value = evt.time;
      form.venue.value = evt.venue;
      form.speaker.value = evt.speaker;
      form.capacity.value = evt.capacity;
      form.description.value = evt.description || '';
      existingImage = evt.image || '';
      if (existingImage) showImagePreview(existingImage);
    }
  }

  wireImageInput((dataUrl) => { existingImage = dataUrl; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateEventForm(form)) return;

    const events = getEvents();
    const capacityNum = parseInt(form.capacity.value, 10);

    if (editId){
      const idx = events.findIndex(ev => ev.id === editId);
      if (idx !== -1){
        // If capacity was reduced below current registrations, cap registrations display-wise only
        events[idx] = {
          ...events[idx],
          name: form.name.value.trim(),
          date: form.date.value,
          time: form.time.value,
          venue: form.venue.value.trim(),
          speaker: form.speaker.value.trim(),
          capacity: capacityNum,
          description: form.description.value.trim(),
          image: existingImage
        };
        saveEvents(events);
        showToast('Event updated successfully');
      }
    } else {
      const newEvent = {
        id: generateId(),
        name: form.name.value.trim(),
        date: form.date.value,
        time: form.time.value,
        venue: form.venue.value.trim(),
        speaker: form.speaker.value.trim(),
        capacity: capacityNum,
        description: form.description.value.trim(),
        image: existingImage
      };
      events.push(newEvent);
      saveEvents(events);
      const regs = getAllRegistrations();
      regs[newEvent.id] = [];
      saveAllRegistrations(regs);
      showToast('Event added successfully');
    }

    setTimeout(() => { window.location.href = 'events.html'; }, 650);
  });
}

function validateEventForm(form){
  let valid = true;
  const fields = [
    { name: 'name', check: v => v.trim().length >= 3, msg: 'Enter an event name (min 3 characters).' },
    { name: 'date', check: v => v.length > 0, msg: 'Pick a date.' },
    { name: 'time', check: v => v.length > 0, msg: 'Pick a time.' },
    { name: 'venue', check: v => v.trim().length >= 2, msg: 'Enter a venue.' },
    { name: 'speaker', check: v => v.trim().length >= 2, msg: 'Enter a speaker name.' },
    { name: 'capacity', check: v => parseInt(v, 10) > 0, msg: 'Capacity must be a positive number.' }
  ];

  fields.forEach(({ name, check, msg }) => {
    const input = form[name];
    const wrap = input.closest('.form-field');
    const errorEl = wrap.querySelector('.field-error');
    if (!check(input.value)){
      wrap.classList.add('has-error');
      errorEl.textContent = msg;
      valid = false;
    } else {
      wrap.classList.remove('has-error');
      errorEl.textContent = '';
    }
  });

  return valid;
}

function wireImageInput(onLoaded){
  const fileInput = document.getElementById('imageInput');
  const drop = document.getElementById('imageDrop');
  if (!fileInput || !drop) return;
  drop.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      showImagePreview(reader.result);
      onLoaded(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function showImagePreview(dataUrl){
  const preview = document.getElementById('imagePreview');
  if (!preview) return;
  preview.querySelector('img').src = dataUrl;
  preview.classList.add('show');
}

/* =========================================================
   PAGE: Event details (event-details.html)
   ========================================================= */
function renderEventDetails(){
  const id = getQueryParam('id');
  const evt = id ? getEventById(id) : null;
  const container = document.getElementById('detailsContainer');
  if (!container) return;

  if (!evt){
    container.innerHTML = `
      <div class="empty-state">
        <div class="big-ico">🚫</div>
        <p>This event could not be found. It may have been deleted.</p>
        <div style="margin-top:14px;"><a class="btn btn-primary" href="events.html">Back to events</a></div>
      </div>`;
    return;
  }

  const status = computeStatus(evt);
  const pct = progressPercent(evt);
  const regCount = registrationCountFor(evt);
  const regs = getRegistrationsFor(evt.id);

  document.title = `${evt.name} · CSI AITR Events`;

  const imageHtml = evt.image
    ? `<img src="${evt.image}" alt="${escapeHtml(evt.name)} cover" style="width:100%; max-height:260px; object-fit:cover; border-radius:14px; margin-bottom:20px;" />`
    : '';

  container.innerHTML = `
    <div class="details-hero">
      ${imageHtml}
      <div class="details-top">
        <div>
          <span class="status-badge status-${status}">${statusLabel(status)}</span>
          <h1 style="margin-top:10px;">${escapeHtml(evt.name)}</h1>
          <p>Hosted by ${escapeHtml(evt.speaker)}</p>
        </div>
        <div style="display:flex; gap:8px;">
          <a class="btn btn-outline" href="add-event.html?id=${evt.id}">✏️ Edit</a>
          <button class="btn btn-danger" id="detailsDeleteBtn">🗑️ Delete</button>
        </div>
      </div>

      <div class="details-grid">
        <div class="item"><div class="k">Date</div><div class="v">${formatDateReadable(evt.date)}</div></div>
        <div class="item"><div class="k">Time</div><div class="v">${formatTimeReadable(evt.time)}</div></div>
        <div class="item"><div class="k">Venue</div><div class="v">${escapeHtml(evt.venue)}</div></div>
        <div class="item"><div class="k">Capacity</div><div class="v mono">${evt.capacity}</div></div>
        <div class="item"><div class="k">Registered</div><div class="v mono">${regCount}</div></div>
      </div>

      ${evt.description ? `<p class="details-desc">${escapeHtml(evt.description)}</p>` : ''}

      <div class="progress-block" style="margin-top:22px; max-width:380px;">
        <div class="progress-labels">
          <span>Registration progress</span>
          <span class="pct mono">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${pct >= 100 ? 'full' : ''}" style="width:${pct}%"></div>
        </div>
      </div>
    </div>

    <div class="section-head" style="margin-top:8px;">
      <h2>Registered participants <span class="count-pill">${regCount}</span></h2>
    </div>
    ${renderRegistrationTable(regs)}
  `;

  document.getElementById('detailsDeleteBtn').addEventListener('click', () => {
    openDeleteModal(evt.id, evt.name);
  });
  wireDeleteModal(() => { window.location.href = 'events.html'; });
}

function renderRegistrationTable(regs){
  if (regs.length === 0){
    return `<div class="empty-state"><div class="big-ico">🧑‍🎓</div><p>No one has registered for this event yet.</p></div>`;
  }
  const rows = regs.map(r => `
    <tr>
      <td><span class="avatar-chip">${initials(r.name)}</span>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.email)}</td>
      <td>${escapeHtml(r.dept)}</td>
    </tr>
  `).join('');
  return `
    <div class="reg-table-wrap">
      <table class="reg-table">
        <thead><tr><th>Name</th><th>Email</th><th>College / Department</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ---------------------------------------------------------
   Small util
   --------------------------------------------------------- */
function setText(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initData();
  wireChrome();

  const page = document.body.dataset.page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'events') renderEventsPage();
  if (page === 'add-event') renderAddEventForm();
  if (page === 'event-details') renderEventDetails();
});
