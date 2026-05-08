# LifeLink

A client-side healthcare utility app built with React, Vite, and Tailwind CSS v4.

---

## Features

### Emergency SOS
- Floating button with 3-second countdown modal before dialling emergency services (`tel:112`)
- Fetches GPS coordinates via the browser Geolocation API and displays them in the modal
- Reads emergency contact details saved in the user's profile

### First Aid Guide
- Step-by-step instructions for 6 common emergencies (cuts, burns, fractures, CPR, fever, food poisoning)
- Keyword search filter across all cards
- "Learn More" modal with do/don't list and a link to a YouTube first aid tutorial
- Web Share API integration with clipboard fallback

### Doctor & Facility Finder
- Queries the [OpenStreetMap Overpass API](https://overpass-api.de) for real nearby hospitals, clinics, pharmacies, and GP practices
- Uses the browser Geolocation API to detect position; reverse-geocodes via [Nominatim](https://nominatim.openstreetmap.org)
- Haversine formula for accurate distance calculation
- "Book Appointment" modal — date, time-slot picker, patient details saved to `localStorage`
- "Get Directions" links to Google Maps using the facility's coordinates
- Saved facilities persist across sessions via `localStorage`

### Wellness Dashboard
- **Hydration tracker** — logs glasses of water per day, resets at midnight
- **BMI calculator** — interactive sliders, category label, persisted result
- **Habit tracker** — water, sleep, exercise, steps with +/− controls and progress bars; daily reset
- **Meal plan** — macros breakdown per meal, "View Recipe" opens a targeted Google search

### Profile
- Stores name, age, blood group, medical conditions, and emergency contact in `localStorage`
- Dark mode toggle (class-based, applied to `<html>` before first render to avoid flash)

### Dashboard Home
- Overview of today's stats (water, exercise, steps, BMI)
- Upcoming appointments from `localStorage`
- Quick-action tiles for each section

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Animations | Motion (Framer Motion v12) |
| UI primitives | Radix UI (Accordion, Progress) |
| Icons | Lucide React |
| Notifications | Sonner |
| External APIs | OpenStreetMap Overpass API, Nominatim |
| State / persistence | React `useState`, custom `useLocalStorage` hook |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Dashboard shell, routing, dark mode
│   ├── hooks/
│   │   └── useLocalStorage.ts   # Typed localStorage hook with daily-reset utility
│   └── components/
│       ├── HomeDashboard.tsx
│       ├── EmergencySOS.tsx
│       ├── FirstAidCards.tsx
│       ├── DoctorFinder.tsx
│       ├── WellnessDashboard.tsx
│       └── Profile.tsx
├── styles/
│   ├── index.css
│   ├── theme.css                # CSS custom properties, dark mode vars
│   ├── fonts.css
│   └── tailwind.css
└── main.tsx
```

---

## Running Locally

```bash
# Install dependencies
pnpm install
pnpm approve-builds   # approves esbuild and @tailwindcss/oxide native builds

# Start dev server
pnpm dev              # http://localhost:5173
```

> If `pnpm` is not installed: `npm install -g pnpm`

---

## Data & Privacy

All user data (profile, appointments, habits, BMI) is stored exclusively in the browser's `localStorage`. Nothing is sent to any server. The only external network requests made at runtime are:

- `overpass-api.de` — facility search (triggered by user action)
- `nominatim.openstreetmap.org` — reverse geocoding (triggered by user action)

---

## Limitations

- Facility data quality depends on OpenStreetMap coverage in the user's area
- Individual doctor names are not available from free public APIs; the finder returns healthcare facilities (hospitals, clinics, GP practices)
- Appointment booking is simulated locally — there is no integration with any real scheduling system
