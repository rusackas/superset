/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * This script fetches Superset Community Calendar events from Google Calendar
 * and stores them as a JSON file for use in the documentation site.
 *
 * Usage: node scripts/fetch-calendar-events.mjs
 *
 * The script fetches public calendar events from the Superset community calendar
 * and saves them to src/data/calendar-events.json for build-time rendering.
 */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.resolve(__dirname, '..');
const DATA_OUTPUT_DIR = path.join(DOCS_DIR, 'src/data');
const DATA_OUTPUT_FILE = path.join(DATA_OUTPUT_DIR, 'calendar-events.json');

// Superset community calendar ID
const CALENDAR_ID = 'superset.committers@gmail.com';

// Google Calendar API key from environment variable (optional, uses public access if not set)
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;

/**
 * Fetch calendar events from Google Calendar API
 */
async function fetchCalendarEvents() {
  console.log('Fetching Superset Community Calendar events...');

  // Calculate date range: from 1 month ago to 1 year in the future
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const timeMin = oneMonthAgo.toISOString();
  const timeMax = oneYearFromNow.toISOString();

  // Build API URL
  const params = new URLSearchParams({
    orderBy: 'startTime',
    singleEvents: 'true',
    timeMin: timeMin,
    timeMax: timeMax,
    maxResults: '100',
  });

  if (API_KEY) {
    params.append('key', API_KEY);
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params.toString()}`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(new Error(`Failed to parse JSON: ${error.message}`));
            }
          } else {
            reject(
              new Error(
                `API request failed with status ${res.statusCode}: ${data}`,
              ),
            );
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Transform Google Calendar API response to simplified format
 */
function transformEvents(apiResponse) {
  if (!apiResponse.items || !Array.isArray(apiResponse.items)) {
    return [];
  }

  return apiResponse.items.map((event) => {
    // Handle both date and dateTime formats
    const startDate = event.start?.dateTime || event.start?.date;
    const endDate = event.end?.dateTime || event.end?.date;
    const isAllDay = !event.start?.dateTime;

    return {
      id: event.id,
      summary: event.summary || 'Untitled Event',
      description: event.description || '',
      location: event.location || '',
      start: startDate,
      end: endDate,
      isAllDay: isAllDay,
      htmlLink: event.htmlLink,
      status: event.status,
      created: event.created,
      updated: event.updated,
      organizer: {
        email: event.organizer?.email,
        displayName: event.organizer?.displayName,
      },
      conferenceData: event.conferenceData
        ? {
            entryPoints: event.conferenceData.entryPoints,
            conferenceSolution: event.conferenceData.conferenceSolution,
          }
        : null,
    };
  });
}

/**
 * Generate fallback data in case of API failure
 */
function generateFallbackData() {
  console.log('Using fallback calendar data...');
  return {
    fetchedAt: new Date().toISOString(),
    source: 'fallback',
    calendarId: CALENDAR_ID,
    events: [
      {
        id: 'fallback-1',
        summary: 'Community Meetup',
        description:
          'Join us for our regular community meetup! Visit the calendar subscription link to see live events.',
        location: 'Virtual',
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
        ).toISOString(),
        isAllDay: false,
        htmlLink: `https://calendar.google.com/calendar/u/0/r?cid=${CALENDAR_ID}`,
        status: 'confirmed',
      },
    ],
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(DATA_OUTPUT_DIR)) {
      fs.mkdirSync(DATA_OUTPUT_DIR, { recursive: true });
    }

    let events = [];
    let source = 'api';

    try {
      const apiResponse = await fetchCalendarEvents();
      events = transformEvents(apiResponse);
      console.log(`✓ Successfully fetched ${events.length} calendar events`);
    } catch (error) {
      console.warn('⚠ Failed to fetch calendar events:', error.message);
      console.warn('  Generating fallback data...');
      const fallbackData = generateFallbackData();
      events = fallbackData.events;
      source = fallbackData.source;
    }

    // Create output data structure
    const outputData = {
      fetchedAt: new Date().toISOString(),
      source: source,
      calendarId: CALENDAR_ID,
      events: events,
    };

    // Write to file
    fs.writeFileSync(DATA_OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`✓ Calendar events saved to ${DATA_OUTPUT_FILE}`);

    if (source === 'fallback') {
      console.log(
        '\n⚠ Note: Using fallback data. To fetch live events, set GOOGLE_CALENDAR_API_KEY environment variable.',
      );
      console.log(
        '  Or the calendar may be private. Check https://developers.google.com/calendar/api/v3/reference/events/list',
      );
    }
  } catch (error) {
    console.error('✗ Error generating calendar data:', error);
    process.exit(1);
  }
}

main();
