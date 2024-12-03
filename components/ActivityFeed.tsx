import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  RiCalendarEventLine,
  RiMailLine,
  RiMessage2Line,
  RiTaskLine,
  RiTimeLine,
} from 'react-icons/ri';

interface Activity {
  id: string;
  type: 'calendar' | 'email' | 'message' | 'task';
  title: string;
  description?: string;
  timestamp: Date;
  status?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityIcon = {
  calendar: RiCalendarEventLine,
  email: RiMailLine,
  message: RiMessage2Line,
  task: RiTaskLine,
};

const ActivityColor = {
  calendar: 'text-blue-400 bg-blue-400/10',
  email: 'text-purple-400 bg-purple-400/10',
  message: 'text-green-400 bg-green-400/10',
  task: 'text-orange-400 bg-orange-400/10',
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = ActivityIcon[activity.type];
        const colorClass = ActivityColor[activity.type];

        return (
          <div
            key={activity.id}
            className={`relative flex items-start space-x-4 p-4 rounded-lg
                     bg-dark-card border border-gray-800/50
                     transition-all duration-200 hover:bg-dark-accent/50
                     ${index === 0 ? 'animate-fade-in' : ''}`}
          >
            {/* Activity Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full
                         ${colorClass} p-2`}>
              <Icon className="w-6 h-6" />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  {activity.title}
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <RiTimeLine className="w-4 h-4 mr-1" />
                  <time
                    dateTime={activity.timestamp.toISOString()}
                    title={format(activity.timestamp, 'PPpp')}
                  >
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </time>
                </div>
              </div>
              
              {activity.description && (
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                  {activity.description}
                </p>
              )}

              {activity.status && (
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full
                             text-xs font-medium bg-gray-800 text-gray-300">
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
