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

import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { Calendar, Badge, Card, List, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import calendarData from '../data/calendar-events.json';

dayjs.extend(isBetween);

const { Title, Text, Paragraph } = Typography;

interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  location?: string;
  start: string;
  end: string;
  isAllDay: boolean;
  htmlLink?: string;
  status: string;
  organizer?: {
    email?: string;
    displayName?: string;
  };
  conferenceData?: {
    entryPoints?: Array<{
      uri: string;
      label?: string;
      entryPointType: string;
    }>;
  };
}

interface CalendarData {
  fetchedAt: string;
  source: string;
  calendarId: string;
  events: CalendarEvent[];
}

const StyledCalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledCalendarWrapper = styled.div`
  background: var(--ifm-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;

  .ant-picker-calendar {
    background: var(--ifm-background-color);
  }

  .ant-picker-calendar-header {
    padding: 12px 0;
    border-bottom: 1px solid var(--ifm-border-color);
  }

  .ant-picker-calendar-date {
    border: 1px solid var(--ifm-border-color);
  }

  .ant-picker-calendar-date-today {
    border-color: var(--ifm-color-primary);
  }

  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-selected:hover .ant-picker-cell-inner {
    background: var(--ifm-color-primary-lighter);
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledEventsList = styled.div`
  background: var(--ifm-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EventBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`;

const EventTime = styled.span`
  color: var(--ifm-color-secondary);
  font-size: 14px;
  margin-left: 8px;
`;

const EventDescription = styled(Paragraph)`
  color: var(--ifm-color-secondary);
  font-size: 14px;
  margin-top: 8px;
  white-space: pre-wrap;
`;

const EventLink = styled.a`
  display: inline-block;
  margin-top: 8px;
  color: var(--ifm-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DataSourceNote = styled.div`
  margin-top: 20px;
  padding: 12px;
  background: var(--ifm-color-info-lighter);
  border-left: 4px solid var(--ifm-color-info);
  border-radius: 4px;
  font-size: 14px;
  color: var(--ifm-color-secondary);
`;

const CommunityCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const events = (calendarData as CalendarData).events;

  // Group events by date for calendar cell rendering
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach((event) => {
      const eventStart = dayjs(event.start);
      const dateKey = eventStart.format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

  // Get upcoming events (next 30 days)
  const upcomingEvents = useMemo(() => {
    const now = dayjs();
    const thirtyDaysFromNow = now.add(30, 'day');
    return events
      .filter((event) => {
        const eventStart = dayjs(event.start);
        return eventStart.isBetween(now, thirtyDaysFromNow, 'day', '[]');
      })
      .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
  }, [events]);

  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format('YYYY-MM-DD');
    const dateEvents = eventsByDate[dateKey] || [];

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dateEvents.slice(0, 2).map((event) => (
          <li key={event.id}>
            <EventBadge
              status="processing"
              text={
                <span
                  style={{
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    maxWidth: '100%',
                  }}
                >
                  {event.summary}
                </span>
              }
            />
          </li>
        ))}
        {dateEvents.length > 2 && (
          <li>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              +{dateEvents.length - 2} more
            </Text>
          </li>
        )}
      </ul>
    );
  };

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.isAllDay) {
      return 'All Day';
    }
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
  };

  const renderEventItem = (event: CalendarEvent) => {
    const eventStart = dayjs(event.start);
    const meetingLink = event.conferenceData?.entryPoints?.[0]?.uri;

    return (
      <List.Item key={event.id}>
        <Card
          size="small"
          style={{ width: '100%', marginBottom: '8px' }}
          title={
            <div>
              <CalendarOutlined style={{ marginRight: 8 }} />
              <strong>{event.summary}</strong>
              <EventTime>{formatEventTime(event)}</EventTime>
            </div>
          }
        >
          <div>
            <Text type="secondary">{eventStart.format('MMMM D, YYYY')}</Text>
            {event.location && (
              <div style={{ marginTop: 8 }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                <Text>{event.location}</Text>
              </div>
            )}
            {event.description && (
              <EventDescription ellipsis={{ rows: 3, expandable: true }}>
                {event.description}
              </EventDescription>
            )}
            <div style={{ marginTop: 8 }}>
              {meetingLink && (
                <EventLink
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Join meeting for ${event.summary}`}
                >
                  Join Meeting
                </EventLink>
              )}
              {event.htmlLink && (
                <EventLink
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: meetingLink ? 16 : 0 }}
                  aria-label={`View ${event.summary} on Google Calendar`}
                >
                  View in Calendar
                </EventLink>
              )}
            </div>
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    <StyledCalendarContainer>
      <StyledCalendarWrapper>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          value={selectedDate}
        />
      </StyledCalendarWrapper>

      {selectedDateEvents.length > 0 && (
        <StyledEventsList>
          <Title level={3}>
            Events on {selectedDate.format('MMMM D, YYYY')}
          </Title>
          <List
            dataSource={selectedDateEvents}
            renderItem={renderEventItem}
            locale={{
              emptyText: 'No events scheduled for this date',
            }}
          />
        </StyledEventsList>
      )}

      <StyledEventsList style={{ marginTop: 20 }}>
        <Title level={3}>Upcoming Events (Next 30 Days)</Title>
        <List
          dataSource={upcomingEvents}
          renderItem={renderEventItem}
          locale={{
            emptyText: 'No upcoming events in the next 30 days',
          }}
        />
      </StyledEventsList>

      {(calendarData as CalendarData).source === 'fallback' && (
        <DataSourceNote>
          <strong>Note:</strong> Calendar is showing sample data. Visit the{' '}
          <a
            href={`https://calendar.google.com/calendar/u/0/r?cid=${(calendarData as CalendarData).calendarId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            live calendar
          </a>{' '}
          to see all current events.
        </DataSourceNote>
      )}
    </StyledCalendarContainer>
  );
};

export default CommunityCalendar;
