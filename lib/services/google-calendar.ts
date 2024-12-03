import { google } from 'googleapis';
import { CalendarEvent, CalendarService } from '../../types/calendar';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService implements CalendarService {
  private calendar;

  constructor(auth: OAuth2Client) {
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  private convertToCalendarEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      title: event.summary,
      description: event.description,
      startTime: new Date(event.start.dateTime || event.start.date),
      endTime: new Date(event.end.dateTime || event.end.date),
      location: event.location,
      attendees: event.attendees?.map((a: any) => a.email) || [],
      videoLink: event.hangoutLink,
      source: 'google'
    };
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return (response.data.items || []).map(this.convertToCalendarEvent);
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      throw error;
    }
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.startTime.toISOString(),
          },
          end: {
            dateTime: event.endTime.toISOString(),
          },
          location: event.location,
          attendees: event.attendees?.map(email => ({ email })),
        },
      });

      return this.convertToCalendarEvent(response.data);
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: event.id,
        requestBody: {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.startTime.toISOString(),
          },
          end: {
            dateTime: event.endTime.toISOString(),
          },
          location: event.location,
          attendees: event.attendees?.map(email => ({ email })),
        },
      });

      return this.convertToCalendarEvent(response.data);
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }
}
