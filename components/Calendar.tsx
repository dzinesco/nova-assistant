import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import type { CalendarEvent } from '../types/calendar';

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfWeek(selectedDate);
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
  }, [selectedDate]);

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), date));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Calendar</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => (
          <div key={date.toString()} className="space-y-2">
            <div className="text-center p-2 bg-gray-700 rounded">
              <div className="text-sm text-gray-400">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-semibold">
                {format(date, 'd')}
              </div>
            </div>
            <div className="space-y-1">
              {getDayEvents(date).map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left p-2 bg-primary-600 rounded text-sm hover:bg-primary-500 transition-colors"
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-xs text-gray-300">
                    {format(new Date(event.startTime), 'HH:mm')}
                  </div>
                  {event.videoLink && (
                    <div className="text-xs text-blue-300 truncate">
                      Video Call Available
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
