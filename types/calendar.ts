export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  videoLink?: string;
  source: 'google' | 'outlook' | 'zoom';
}

export interface CalendarService {
  getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, 'id' | 'source'>): Promise<CalendarEvent>;
  updateEvent(event: CalendarEvent): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<void>;
}

export interface EmailMessage {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  cc?: string[];
  date: Date;
  hasAttachments: boolean;
  source: 'gmail' | 'outlook';
}

export interface EmailService {
  getMessages(limit?: number): Promise<EmailMessage[]>;
  sendMessage(message: Omit<EmailMessage, 'id' | 'date' | 'hasAttachments' | 'source'>): Promise<EmailMessage>;
  getThread(threadId: string): Promise<EmailMessage[]>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  channel: string;
  threadId?: string;
  source: 'slack' | 'teams';
}

export interface ChatService {
  sendMessage(channel: string, content: string, threadId?: string): Promise<ChatMessage>;
  getChannelMessages(channel: string, limit?: number): Promise<ChatMessage[]>;
  getThreadMessages(threadId: string): Promise<ChatMessage[]>;
}
