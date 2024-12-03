import React, { createContext, useContext, useState, useEffect } from 'react';

type EmailProvider = 'gmail' | 'outlook' | 'smtp';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

interface EmailSettings {
  provider: EmailProvider;
  email: string;
  clientId?: string;
  clientSecret?: string;
  smtpConfig?: SMTPConfig;
  notifications: {
    enabled: boolean;
    desktop: boolean;
    sound: boolean;
    frequency: 'realtime' | 'batched' | 'manual';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  sync: {
    enabled: boolean;
    interval: number; // in minutes
    folders: string[];
    maxEmails: number;
  };
  filters: {
    enabled: boolean;
    rules: Array<{
      id: string;
      name: string;
      conditions: Array<{
        field: 'subject' | 'from' | 'to' | 'body';
        operator: 'contains' | 'not_contains' | 'equals' | 'not_equals';
        value: string;
      }>;
      actions: Array<{
        type: 'move' | 'mark' | 'forward' | 'delete';
        value: string;
      }>;
    }>;
  };
}

const defaultSettings: EmailSettings = {
  provider: 'gmail',
  email: '',
  notifications: {
    enabled: true,
    desktop: true,
    sound: true,
    frequency: 'realtime',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  },
  sync: {
    enabled: true,
    interval: 5,
    folders: ['INBOX', 'Sent', 'Drafts'],
    maxEmails: 1000,
  },
  filters: {
    enabled: false,
    rules: [],
  },
};

interface EmailContextType {
  settings: EmailSettings;
  updateSettings: (updates: Partial<EmailSettings>) => void;
  updateNotifications: (updates: Partial<EmailSettings['notifications']>) => void;
  updateSync: (updates: Partial<EmailSettings['sync']>) => void;
  updateFilters: (updates: Partial<EmailSettings['filters']>) => void;
  addFilterRule: (rule: EmailSettings['filters']['rules'][0]) => void;
  removeFilterRule: (id: string) => void;
  updateFilterRule: (id: string, updates: Partial<EmailSettings['filters']['rules'][0]>) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<EmailSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emailSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved email settings:', e);
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (updates: Partial<EmailSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const updateNotifications = (updates: Partial<EmailSettings['notifications']>) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...updates,
      },
    }));
  };

  const updateSync = (updates: Partial<EmailSettings['sync']>) => {
    setSettings(prev => ({
      ...prev,
      sync: {
        ...prev.sync,
        ...updates,
      },
    }));
  };

  const updateFilters = (updates: Partial<EmailSettings['filters']>) => {
    setSettings(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...updates,
      },
    }));
  };

  const addFilterRule = (rule: EmailSettings['filters']['rules'][0]) => {
    setSettings(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        rules: [...prev.filters.rules, rule],
      },
    }));
  };

  const removeFilterRule = (id: string) => {
    setSettings(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        rules: prev.filters.rules.filter(rule => rule.id !== id),
      },
    }));
  };

  const updateFilterRule = (id: string, updates: Partial<EmailSettings['filters']['rules'][0]>) => {
    setSettings(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        rules: prev.filters.rules.map(rule =>
          rule.id === id ? { ...rule, ...updates } : rule
        ),
      },
    }));
  };

  return (
    <EmailContext.Provider
      value={{
        settings,
        updateSettings,
        updateNotifications,
        updateSync,
        updateFilters,
        addFilterRule,
        removeFilterRule,
        updateFilterRule,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
}
