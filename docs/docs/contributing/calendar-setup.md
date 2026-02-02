---
title: Community Calendar Setup
sidebar_position: 6
---

# Community Calendar Setup

This guide explains how to set up, maintain, and troubleshoot the Superset Community Calendar feature in the documentation site.

## Overview

The Community Calendar displays upcoming Superset community events (meetups, demos, discussions) on the documentation website. The calendar data is fetched from Google Calendar at build time and rendered using React and Ant Design components.

## Architecture

### Components

1. **Fetch Script** (`docs/scripts/fetch-calendar-events.mjs`)
   - Node.js script that fetches calendar events from Google Calendar API
   - Runs during the build process (`yarn run generate:calendar-events`)
   - Stores events in `docs/src/data/calendar-events.json`
   - Falls back to sample data if the API is unavailable

2. **React Component** (`docs/src/components/CommunityCalendar.tsx`)
   - Displays calendar using Ant Design's Calendar component
   - Shows events in both calendar view and list view
   - Responsive and accessible design
   - Reads data from the generated JSON file

3. **Calendar Data** (`docs/src/data/calendar-events.json`)
   - Generated at build time
   - Contains event details (title, description, date, time, location)
   - Committed to the repository for build reproducibility

### Build Process

The calendar fetch script is integrated into the documentation build pipeline:

```bash
yarn run generate:all
```

This command runs:
1. `generate:extension-components`
2. `generate:superset-components`
3. `generate:database-docs`
4. `generate:calendar-events` ← Calendar fetch
5. `generate:api-docs`

## Setup

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn package manager
- Access to the Superset community Google Calendar (public read access)

### Optional: Google Calendar API Key

The script can fetch events from the public Google Calendar without an API key. However, if you want to use an authenticated API key for higher rate limits:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create credentials (API Key)
5. Set the environment variable:

```bash
export GOOGLE_CALENDAR_API_KEY=your-api-key-here
```

### Installation

Install dependencies:

```bash
cd docs
yarn install
```

## Usage

### Fetch Calendar Events

Manually fetch calendar events:

```bash
cd docs
yarn run generate:calendar-events
```

This will create/update `docs/src/data/calendar-events.json`.

### Build Documentation

The calendar data is automatically fetched during the documentation build:

```bash
cd docs
yarn run build
```

### Development Server

Start the development server (calendar data is fetched on start):

```bash
cd docs
yarn start
```

## Managing Calendar Events

### Adding Events

Events are managed directly in the Google Calendar:

1. Access the Superset Community Calendar at `superset.committers@gmail.com`
2. Add events with the following information:
   - **Title**: Short, descriptive event name
   - **Date/Time**: Event start and end time (or mark as all-day)
   - **Description**: Detailed event information (supports plain text)
   - **Location**: Physical location or "Virtual"
   - **Conference Link**: Add Zoom/Meet links in the event details

Events added to the calendar will be automatically included in the next documentation build.

### Event Data Retention

The fetch script retrieves events from:
- **Past**: 1 month ago
- **Future**: 1 year from now

This range ensures recent past events are visible while focusing on upcoming events.

### Removing Events

1. Delete or cancel the event in Google Calendar
2. Rebuild the documentation to update the data

## Customization

### Changing Calendar Source

To use a different Google Calendar, update the `CALENDAR_ID` in `docs/scripts/fetch-calendar-events.mjs`:

```javascript
const CALENDAR_ID = 'your-calendar-id@gmail.com';
```

### Adjusting Event Range

Modify the date range in `fetch-calendar-events.mjs`:

```javascript
// Current: 1 month ago to 1 year ahead
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

// Example: 2 months ago to 6 months ahead
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);
oneYearFromNow.setMonth(oneYearFromNow.getMonth() + 6);
```

### Styling the Calendar

The calendar styles are defined in `docs/src/components/CommunityCalendar.tsx` using Emotion styled components. The component uses Ant Design's theming system and CSS variables from Docusaurus:

- `--ifm-background-color`: Background colors
- `--ifm-border-color`: Border colors
- `--ifm-color-primary`: Primary brand color
- `--ifm-color-secondary`: Secondary text color

## Troubleshooting

### Calendar Data Not Updating

**Problem**: Calendar shows old events after rebuilding.

**Solutions**:
1. Delete `docs/src/data/calendar-events.json` and rebuild
2. Check that `generate:calendar-events` is running in the build
3. Verify the Google Calendar is publicly accessible

### API Rate Limiting

**Problem**: Build fails with API rate limit errors.

**Solutions**:
1. Set up a Google Calendar API key (see Setup section)
2. Reduce build frequency
3. The script will automatically fall back to sample data

### Calendar Not Displaying

**Problem**: Calendar component doesn't render on the community page.

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify `calendar-events.json` exists and is valid JSON
3. Check that `dayjs` dependency is installed
4. Run `yarn typecheck` to verify TypeScript compilation

### Fallback Data Shown

**Problem**: Calendar displays "sample data" message.

**Reason**: The fetch script couldn't connect to the Google Calendar API (network issues, API unavailable, etc.).

**Solutions**:
1. Check network connectivity
2. Verify the calendar is publicly accessible
3. Try setting a Google Calendar API key
4. For production builds, ensure the build environment has internet access

## Accessibility

The calendar component follows accessibility best practices:

- **Keyboard Navigation**: Full keyboard support via Ant Design Calendar
- **Screen Readers**: All interactive elements have proper ARIA labels
- **Color Contrast**: Uses theme colors with sufficient contrast ratios
- **Focus Management**: Clear focus indicators on interactive elements

## Testing

### Manual Testing

1. Start the development server:
```bash
cd docs
yarn start
```

2. Navigate to `/community`
3. Verify:
   - Calendar displays correctly
   - Events appear in calendar cells
   - Event details show in the list below
   - Links work properly
   - Responsive design works on mobile

### Automated Testing

Run TypeScript type checking:

```bash
cd docs
yarn typecheck
```

## CI/CD Integration

The calendar fetch script is integrated into the documentation build pipeline. On every merge to `master`:

1. GitHub Actions (or your CI system) runs `yarn build`
2. The build includes `yarn run generate:calendar-events`
3. Calendar data is fetched and stored
4. Documentation is built with the latest calendar data
5. Static site is deployed

No additional CI configuration is needed beyond the standard documentation build process.

## Maintenance

### Regular Tasks

- **None required**: Calendar events are automatically fetched during builds
- Events are managed in Google Calendar
- No code changes needed for routine event management

### Periodic Reviews

- Review fallback data annually to ensure it's still relevant
- Check that the calendar component styling aligns with design updates
- Verify API key usage (if applicable) and rate limits

## Support

For questions or issues:

- **Calendar Content**: Contact Superset community maintainers
- **Technical Issues**: File an issue on GitHub
- **Build Problems**: Check the troubleshooting section above
