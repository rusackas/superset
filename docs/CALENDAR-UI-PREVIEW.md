# Community Calendar - UI Preview

This document describes the visual appearance and user experience of the Community Calendar feature on the Superset documentation website.

## Page Location

**URL:** `/community`

The calendar appears in the "Superset Community Calendar" section, below the community links section.

## Layout

### Desktop View (> 768px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Superset Community Calendar                          │
│   Join us for live demos, meetups, discussions, and more!              │
│                                                                          │
│   🔗 Subscribe to the Superset Community Calendar                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │             Calendar - February 2026                      │         │
│   ├──────────────────────────────────────────────────────────┤         │
│   │  Sun   Mon   Tue   Wed   Thu   Fri   Sat                │         │
│   │                                   1                      │         │
│   │   2     3     4     5     6     7     8                  │         │
│   │   9    10    11    12    13    14    15                 │         │
│   │  [●]                [●]                                  │         │
│   │  16    17    18    19    20    21    22                 │         │
│   │  23    24    25    26    27    28                       │         │
│   └──────────────────────────────────────────────────────────┘         │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │  Events on February 9, 2026                             │         │
│   ├──────────────────────────────────────────────────────────┤         │
│   │  📅 Community Meetup          1:30 PM - 2:30 PM        │         │
│   │  February 9, 2026                                       │         │
│   │  📍 Virtual                                             │         │
│   │                                                          │         │
│   │  Join us for our regular community meetup!              │         │
│   │  Visit the calendar subscription link...                │         │
│   │                                                          │         │
│   │  [Join Meeting] [View in Calendar]                      │         │
│   └──────────────────────────────────────────────────────────┘         │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │  Upcoming Events (Next 30 Days)                         │         │
│   ├──────────────────────────────────────────────────────────┤         │
│   │  📅 Community Meetup          1:30 PM - 2:30 PM        │         │
│   │  February 9, 2026                                       │         │
│   │  📍 Virtual                                             │         │
│   │                                                          │         │
│   │  📅 Tech Talk: Data Viz      2:00 PM - 3:00 PM        │         │
│   │  February 12, 2026                                      │         │
│   │  📍 Virtual                                             │         │
│   └──────────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌────────────────────────────────┐
│ Superset Community Calendar    │
│ Join us for live demos...      │
│                                 │
│ 🔗 Subscribe                   │
├────────────────────────────────┤
│                                 │
│  Calendar - Feb 2026           │
│  S M T W T F S                 │
│    1 2 3 4 5 6 7               │
│  8 9[●]11 12[●]14 15           │
│  16 17 18 19 20 21 22          │
│  23 24 25 26 27 28             │
│                                 │
│  Events on Feb 9, 2026         │
│  📅 Community Meetup           │
│  1:30 PM - 2:30 PM             │
│  📍 Virtual                    │
│                                 │
│  Join us for our regular...    │
│                                 │
│  [Join] [View]                 │
│                                 │
│  Upcoming Events               │
│  📅 Community Meetup           │
│  Feb 9, 1:30 PM                │
│                                 │
│  📅 Tech Talk                  │
│  Feb 12, 2:00 PM               │
└────────────────────────────────┘
```

## Visual Elements

### Colors (Light Mode)

- **Background:** White (`var(--ifm-background-color)`)
- **Border:** Light gray (`var(--ifm-border-color)`)
- **Primary accent:** Superset blue (`var(--ifm-color-primary)`)
- **Secondary text:** Medium gray (`var(--ifm-color-emphasis-600)`)
- **Event badges:** Blue dots on calendar dates
- **Today's date:** Blue border highlight
- **Selected date:** Light blue background

### Colors (Dark Mode)

- **Background:** Dark gray (`var(--ifm-background-color)`)
- **Border:** Medium gray (`var(--ifm-border-color)`)
- **Primary accent:** Light blue (`var(--ifm-color-primary)`)
- **Secondary text:** Light gray (`var(--ifm-color-emphasis-600)`)
- Same accent colors as light mode

### Typography

- **Headings:** Bold, 20-23px
- **Event titles:** Bold, 16-18px
- **Event details:** Regular, 14px
- **Timestamps:** Medium gray, 14px
- **Links:** Primary color, underline on hover

### Icons

- 📅 CalendarOutlined (from Ant Design Icons) - for events
- 📍 EnvironmentOutlined (from Ant Design Icons) - for locations
- 🔗 Calendar icon SVG - for subscription link

## Interactive Features

### Calendar Interaction

1. **Date Selection:**
   - Click any date to view events on that date
   - Selected date highlights with light blue background
   - Today's date has a blue border

2. **Event Indicators:**
   - Blue dots appear on dates with events
   - Multiple events show multiple dots (up to 2 visible)
   - "+N more" text if more than 2 events

3. **Month Navigation:**
   - Arrow buttons to navigate between months
   - Dropdown to select specific month and year
   - Keyboard accessible (arrow keys)

### Event Cards

Each event displays:
- **Summary/Title** (bold, primary text)
- **Date & Time** (secondary text)
- **Location** (if available, with location icon)
- **Description** (expandable if long)
- **Action buttons:**
  - "Join Meeting" (if conference link available)
  - "View in Calendar" (opens Google Calendar)

### Fallback Notice

When using fallback data:
```
┌─────────────────────────────────────────────────────────┐
│ ℹ️ Note: Calendar is showing sample data. Visit the    │
│ live calendar to see all current events.               │
└─────────────────────────────────────────────────────────┘
```

## User Experience Flow

### Typical User Journey

1. **Lands on /community page**
   - Scrolls to calendar section
   - Sees current month with event dots

2. **Explores calendar**
   - Clicks on a date with event dot
   - Sees event details appear below calendar

3. **Views event details**
   - Reads event description
   - Clicks "Join Meeting" link (if available)
   - Opens in new tab

4. **Checks upcoming events**
   - Scrolls to "Upcoming Events" section
   - Sees chronological list of next 30 days
   - Clicks event links to join or view

5. **Subscribes to calendar (optional)**
   - Clicks "Subscribe" link at top
   - Opens Google Calendar subscription page
   - Adds to their personal calendar

## Accessibility Features

### Keyboard Navigation

- **Tab:** Navigate through interactive elements
- **Arrow keys:** Navigate calendar dates
- **Enter/Space:** Select date, activate buttons
- **Escape:** Close expanded elements

### Screen Reader Support

- All links have descriptive ARIA labels
- Calendar announces selected date
- Event cards have semantic structure
- Proper heading hierarchy (h2 → h3)

### Visual Accessibility

- High contrast text (WCAG AA compliant)
- Focus indicators on all interactive elements
- Large touch targets (44x44px minimum)
- No information conveyed by color alone

## Performance

### Load Time

- Initial render: <100ms
- Calendar data: ~2-10KB
- No external API calls (data fetched at build time)

### Responsiveness

- Calendar adapts to screen size
- Event cards stack vertically on mobile
- Touch-friendly on tablets and phones

## Browser Support

- **Modern browsers:** Full support (Chrome, Firefox, Safari, Edge)
- **IE11:** Not supported (uses modern ES6+ features)
- **Mobile browsers:** Full support (iOS Safari, Chrome Android)

## Example Event Data

### With Meeting Link
```
📅 Monthly Community Sync
February 15, 2026 | 2:00 PM - 3:00 PM
📍 Virtual

Join us for our monthly community sync to discuss...

[Join Meeting] [View in Calendar]
```

### All-Day Event
```
📅 Superset Conference 2026
February 20-22, 2026 | All Day
📍 San Francisco, CA

Three days of talks, workshops, and networking...

[View in Calendar]
```

### Past Event (grayed out)
```
📅 Tech Talk: Advanced Charting
February 5, 2026 | 3:00 PM - 4:00 PM
📍 Virtual (past event)

Learn about advanced charting techniques...

[View in Calendar]
```

## Summary

The Community Calendar provides a clean, accessible, and interactive way for users to discover and attend Superset community events. The design follows Superset documentation aesthetics while providing excellent usability across all devices.
