# LifeLink — Personal Health Companion

A mobile-first healthcare utility app built with React 18 and Vite. LifeLink helps users find nearby medical facilities, manage doctor appointments, track wellness habits, and access emergency tools from a single interface.

---

## Features

- **Facility Finder** — Queries the OpenStreetMap Overpass API to surface nearby hospitals, clinics, pharmacies, dentists, and general practitioners. Results are sorted by distance and filterable by category.
- **Directions** — Platform-aware deep links open Apple Maps on iOS and Google Maps on all other platforms, initiating a routed navigation session to the selected facility.
- **Appointment Management** — Book appointments at any found facility. View, reschedule (new date + time slot), and cancel bookings. Appointments are persisted via `localStorage`.
- **Emergency SOS** — One-tap SOS button with a 3-second countdown. Detects current coordinates, shows a map link, reads the saved emergency contact from your profile, and dials 112 via `tel:` protocol.
- **Wellness Tracker** — Daily habit logging (water intake, exercise, steps, sleep). Displays progress bars and resets automatically at midnight.
- **First Aid Cards** — Offline-accessible step-by-step guides for common emergencies.
- **User Profile** — Stores name, blood group, allergies, and an emergency contact locally.
- **Dark Mode** — System-aware default with a manual toggle, persisted across sessions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (`motion`) |
| UI Primitives | Radix UI |
| Data Fetching | TanStack Query v5 |
| Schema Validation | Zod |
| Location Data | OpenStreetMap Overpass API |
| Geocoding | Nominatim |
| Icons | Lucide React |
| Toasts | Sonner |
| Storage | `localStorage` |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Root layout, navigation, routing
│   ├── components/             # Page-level feature components
│   │   ├── Appointments.tsx
│   │   ├── DoctorFinder.tsx
│   │   ├── EmergencySOS.tsx
│   │   ├── FirstAidCards.tsx
│   │   ├── HomeDashboard.tsx
│   │   ├── Profile.tsx
│   │   └── WellnessDashboard.tsx
│   └── hooks/
│       └── useLocalStorage.ts
├── components/
│   └── common/
│       └── ErrorBoundary.tsx   # Global React error boundary
├── hooks/
│   └── useGeolocation.ts       # Geolocation with retry + timeout
├── services/
│   ├── overpass.ts             # Overpass API queries + data normalisation
│   └── mockHealthcareService.ts # Deterministic mock data for development
├── types/
│   └── facility.ts             # Zod schema + Facility type
├── utils/
│   └── mapLinks.ts             # Platform-aware directions URL builder
└── styles/
    └── index.css               # Entry stylesheet
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, pnpm ≥ 8

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The app requests geolocation permission on the Doctors page. Approve it to load nearby facilities.

---

## Notes

- All user data (profile, appointments, habits) is stored in `localStorage`. No backend or external accounts are required.
- The Overpass API is a public, rate-limited service. Repeated rapid requests from the same IP may be throttled.
- The `mockHealthcareService.ts` file generates deterministic facility data for local development or demos and is not used in the default build.

---

## License

MIT

---

## Limitations

- Facility data quality depends on OpenStreetMap coverage in the user's area.
- Individual doctor names are not available via free public APIs. The finder returns healthcare facilities (hospitals, clinics, GP practices).
- Appointment booking is stored locally — there is no integration with a real scheduling system.
