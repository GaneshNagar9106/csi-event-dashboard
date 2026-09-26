# CSI Event Management Dashboard

A responsive web dashboard for managing CSI AITR events — built for the **CSI AITR Software Development Recruitment — Web Development Task 1**.

## Description

Student chapters run a steady stream of workshops, seminars and contests, and it's easy to lose track of what's upcoming, what's happening today, and who has registered for what. This dashboard gives CSI AITR a single place to add events, track registrations, and see event status at a glance — no backend, no database, just a browser.

## Problem Statement

Build a dashboard that lets committee members:
- See upcoming, ongoing and completed events separately
- Add, edit and delete events
- View who has registered for a specific event
- Search and filter the event list
- See registration progress against each event's capacity
- Use the dashboard comfortably on both desktop and mobile

## Features

- **Dashboard overview** — live counts for total events, upcoming, ongoing, completed, and total registrations, plus a preview of each category
- **Full events page** — every event as a card, with search (name/speaker/venue) and filters (status, venue, date)
- **Add event** — validated form for name, date, time, venue, speaker, capacity, description and an optional cover image
- **Edit event** — the same form, pre-filled, reused for updates
- **Delete event** — confirmation modal before anything is removed
- **Event details page** — full event info plus the list of registered participants
- **Registration progress bar** — calculated live from `registrations / capacity`, capped at 100%
- **Automatic status** — Upcoming / Ongoing / Completed, computed from each event's date & time
- **Fully responsive** — sidebar collapses into a mobile menu, cards stack, tables scroll horizontally instead of breaking

## Technology Stack

- HTML5
- CSS3 (custom properties, CSS Grid & Flexbox, no framework)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` for persistence — no backend required

## Project Structure

```
csi-event-dashboard/
│
├── index.html            → Dashboard overview
├── events.html           → All events, search & filters
├── add-event.html        → Add / edit event form
├── event-details.html    → Single event + registration list
├── style.css             → All styling, design tokens & responsive rules
├── script.js             → Data layer, status logic, and page renderers
├── README.md
└── assets/
    └── images/
```

## How to Run

**Option 1 — just open it**
Double-click `index.html`, or drag it into a browser tab. Everything runs client-side.

**Option 2 — VS Code Live Server (recommended)**
1. Open the project folder in VS Code
2. Install the "Live Server" extension if you don't have it
3. Right-click `index.html` → **Open with Live Server**
4. The dashboard opens at `http://127.0.0.1:5500/index.html`

## How LocalStorage Works

On first load, `script.js` checks whether `localStorage` already has a `csi_events` key.

- **If it's empty** (first visit, or storage was cleared), the app seeds itself with 10 realistic dummy events and matching dummy registrations, and saves them to `localStorage`.
- **If data already exists**, the app loads it as-is — so anything you add, edit or delete stays there after a refresh.

Two keys are used:
- `csi_events` — the array of event objects (name, date, time, venue, speaker, capacity, description, image)
- `csi_registrations` — an object keyed by event id, each holding an array of `{ name, email, dept }` dummy participants

Event status (Upcoming / Ongoing / Completed) and registration progress are **never stored** — they're recalculated every time the page loads, from the event's date/time and its registration count, so they're always accurate.

## Screenshots

_Add screenshots here before submitting — see the list below._

## Live Deployment

`<paste your GitHub Pages link here>`

## GitHub Repository

`<paste your repository link here>`

## Future Improvements

- Real backend + database so registrations persist across devices, not just one browser
- A public registration form so students can register themselves (currently registrations are seeded dummy data)
- Email/SMS reminders for upcoming events
- Role-based login for committee members vs. viewers
- Export the registration list to CSV per event
