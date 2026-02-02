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
 * Simple validation script for calendar data structure
 * Usage: node scripts/validate-calendar-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CALENDAR_DATA_FILE = path.join(
  __dirname,
  '../src/data/calendar-events.json',
);

console.log('Validating calendar data...');

try {
  // Check if file exists
  if (!fs.existsSync(CALENDAR_DATA_FILE)) {
    console.error('✗ Calendar data file not found');
    process.exit(1);
  }

  // Read and parse the JSON
  const data = JSON.parse(fs.readFileSync(CALENDAR_DATA_FILE, 'utf-8'));

  // Validate structure
  const requiredFields = ['fetchedAt', 'source', 'calendarId', 'events'];
  const missingFields = requiredFields.filter((field) => !(field in data));

  if (missingFields.length > 0) {
    console.error(
      `✗ Missing required fields: ${missingFields.join(', ')}`,
    );
    process.exit(1);
  }

  // Validate events array
  if (!Array.isArray(data.events)) {
    console.error('✗ events field must be an array');
    process.exit(1);
  }

  // Validate each event
  const eventRequiredFields = [
    'id',
    'summary',
    'start',
    'end',
    'isAllDay',
    'status',
  ];

  data.events.forEach((event, index) => {
    const missingEventFields = eventRequiredFields.filter(
      (field) => !(field in event),
    );
    if (missingEventFields.length > 0) {
      console.error(
        `✗ Event ${index} missing fields: ${missingEventFields.join(', ')}`,
      );
      process.exit(1);
    }

    // Validate date formats
    try {
      new Date(event.start);
      new Date(event.end);
    } catch {
      console.error(`✗ Event ${index} has invalid date format`);
      process.exit(1);
    }
  });

  // All good!
  console.log('✓ Calendar data structure is valid');
  console.log(`  - Source: ${data.source}`);
  console.log(`  - Calendar ID: ${data.calendarId}`);
  console.log(`  - Events: ${data.events.length}`);
  console.log(`  - Fetched at: ${new Date(data.fetchedAt).toLocaleString()}`);

  if (data.events.length > 0) {
    console.log('\nUpcoming events:');
    data.events.slice(0, 5).forEach((event) => {
      const start = new Date(event.start);
      console.log(`  - ${event.summary} (${start.toLocaleDateString()})`);
    });
    if (data.events.length > 5) {
      console.log(`  ... and ${data.events.length - 5} more`);
    }
  }

  process.exit(0);
} catch (error) {
  console.error('✗ Error validating calendar data:', error.message);
  process.exit(1);
}
