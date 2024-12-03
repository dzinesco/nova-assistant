import { Client } from '@microsoft/microsoft-graph-client';
import { CalendarEvent, CalendarService, EmailMessage, EmailService, ChatMessage, ChatService } from '../../types/calendar';
import 'isomorphic-fetch';

export class MicrosoftGraphService implements CalendarService, EmailService, ChatService {
  private client: Client;

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  // Calendar Service Implementation
  private convertToCalendarEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      title: event.subject,
      description: event.body?.content,
      startTime: new Date(event.start.dateTime + 'Z'),
      endTime: new Date(event.end.dateTime + 'Z'),
      location: event.location?.displayName,
      attendees: event.attendees?.map((a: any) => a.emailAddress.address) || [],
      videoLink: event.onlineMeeting?.joinUrl,
      source: 'outlook'
    };
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const response = await this.client
        .api('/me/calendar/events')
        .filter(`start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`)
        .get();

      return response.value.map(this.convertToCalendarEvent);
    } catch (error) {
      console.error('Error fetching Outlook Calendar events:', error);
      throw error;
    }
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent> {
    try {
      const response = await this.client
        .api('/me/calendar/events')
        .post({
          subject: event.title,
          body: {
            contentType: 'HTML',
            content: event.description
          },
          start: {
            dateTime: event.startTime.toISOString(),
            timeZone: 'UTC'
          },
          end: {
            dateTime: event.endTime.toISOString(),
            timeZone: 'UTC'
          },
          location: {
            displayName: event.location
          },
          attendees: event.attendees?.map(email => ({
            emailAddress: { address: email },
            type: 'required'
          }))
        });

      return this.convertToCalendarEvent(response);
    } catch (error) {
      console.error('Error creating Outlook Calendar event:', error);
      throw error;
    }
  }

  // Email Service Implementation
  private convertToEmailMessage(message: any): EmailMessage {
    return {
      id: message.id,
      subject: message.subject,
      body: message.body.content,
      from: message.from.emailAddress.address,
      to: message.toRecipients.map((r: any) => r.emailAddress.address),
      cc: message.ccRecipients?.map((r: any) => r.emailAddress.address),
      date: new Date(message.receivedDateTime),
      hasAttachments: message.hasAttachments,
      source: 'outlook'
    };
  }

  async getMessages(limit: number = 10): Promise<EmailMessage[]> {
    try {
      const response = await this.client
        .api('/me/messages')
        .top(limit)
        .get();

      return response.value.map(this.convertToEmailMessage);
    } catch (error) {
      console.error('Error fetching Outlook messages:', error);
      throw error;
    }
  }

  async sendMessage(message: Omit<EmailMessage, 'id' | 'date' | 'hasAttachments' | 'source'>): Promise<EmailMessage> {
    try {
      const response = await this.client
        .api('/me/sendMail')
        .post({
          message: {
            subject: message.subject,
            body: {
              contentType: 'HTML',
              content: message.body
            },
            toRecipients: message.to.map(email => ({
              emailAddress: { address: email }
            })),
            ccRecipients: message.cc?.map(email => ({
              emailAddress: { address: email }
            }))
          }
        });

      return this.convertToEmailMessage(response);
    } catch (error) {
      console.error('Error sending Outlook message:', error);
      throw error;
    }
  }

  // Teams Chat Service Implementation
  private convertToChatMessage(message: any): ChatMessage {
    return {
      id: message.id,
      content: message.body.content,
      sender: message.from.user.displayName,
      timestamp: new Date(message.createdDateTime),
      channel: message.channelIdentity.channelId,
      threadId: message.conversationId,
      source: 'teams'
    };
  }

  async sendMessage(channel: string, content: string, threadId?: string): Promise<ChatMessage> {
    try {
      const response = await this.client
        .api(`/teams/${channel}/channels/${threadId}/messages`)
        .post({
          body: {
            content
          }
        });

      return this.convertToChatMessage(response);
    } catch (error) {
      console.error('Error sending Teams message:', error);
      throw error;
    }
  }

  async getChannelMessages(channel: string, limit: number = 10): Promise<ChatMessage[]> {
    try {
      const response = await this.client
        .api(`/teams/${channel}/channels/messages`)
        .top(limit)
        .get();

      return response.value.map(this.convertToChatMessage);
    } catch (error) {
      console.error('Error fetching Teams messages:', error);
      throw error;
    }
  }

  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await this.client
        .api(`/teams/messages/${threadId}/replies`)
        .get();

      return response.value.map(this.convertToChatMessage);
    } catch (error) {
      console.error('Error fetching Teams thread messages:', error);
      throw error;
    }
  }
}
