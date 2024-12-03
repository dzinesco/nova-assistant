import React, { useState, useEffect } from 'react';
import { RiRobot2Line } from 'react-icons/ri';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-lg">
          <RiRobot2Line className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome to Nova Assistant</h1>
          <p className="text-muted-foreground">Your personal AI assistant, ready to help</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              New Task
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
              Schedule Meeting
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  {i === 0 ? "Updated calendar events" : i === 1 ? "Completed daily tasks" : "Sent message to team"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground">
          <h2 className="text-lg font-medium mb-4">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Tasks</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Messages</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Events</p>
              <p className="text-2xl font-semibold">8</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Services</p>
              <p className="text-2xl font-semibold">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
