# Community Calendar Feature

This directory contains the implementation of the Superset Community Calendar feature for the documentation website.

## Overview

The Community Calendar displays upcoming Superset community events (meetups, demos, discussions) on the documentation website. Calendar data is fetched from Google Calendar at build time and rendered using React and Ant Design components.

## Files

- **CommunityCalendar.tsx** - Main React component that renders the calendar
  - Uses Ant Design Calendar component
  - Shows events in both calendar view and list view
  - Responsive and accessible design
  - Imports event data from `../data/calendar-events.json`

## Usage

The calendar component is used on the Community page (`/community`):

```tsx
import CommunityCalendar from '../components/CommunityCalendar';

// In your component:
<CommunityCalendar />
```

## Data Format

The component expects data in the following format (from `../data/calendar-events.json`):

```json
{
  "fetchedAt": "2026-02-02T13:30:35.122Z",
  "source": "api",
  "calendarId": "superset.committers@gmail.com",
  "events": [
    {
      "id": "event-id",
      "summary": "Event Title",
      "description": "Event description",
      "location": "Location or Virtual",
      "start": "2026-02-09T13:30:35.122Z",
      "end": "2026-02-09T14:30:35.122Z",
      "isAllDay": false,
      "htmlLink": "https://calendar.google.com/...",
      "status": "confirmed",
      "organizer": {
        "email": "organizer@example.com",
        "displayName": "Organizer Name"
      },
      "conferenceData": {
        "entryPoints": [
          {
            "uri": "https://meet.google.com/...",
            "entryPointType": "video"
          }
        ]
      }
    }
  ]
}
```

## Features

- **Calendar View**: Interactive calendar with event markers on dates
- **Event Details**: Click on dates to see full event details
- **Upcoming Events**: Shows next 30 days of events in a list
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: Full keyboard navigation and screen reader support
- **Links**: Direct links to join meetings and view events in Google Calendar

## Development

### Dependencies

- React 18.3.1
- Ant Design 6.2.2
- dayjs 1.11.13
- @emotion/styled 11.14.1

### Styling

The component uses Emotion for styling and follows Superset documentation design patterns:
- Uses CSS variables from Docusaurus theme
- Responsive breakpoints via `mq` utility
- Ant Design theming tokens

### Accessibility

- Keyboard navigable calendar
- ARIA labels on all links
- Semantic HTML structure
- Screen reader friendly

## Documentation

Full setup and maintenance documentation is available at:
- `docs/docs/contributing/calendar-setup.md`

## License

Licensed under the Apache License, Version 2.0. See the LICENSE file in the root of the repository for details.
