import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIProvider {
  name: 'openai' | 'anthropic' | 'grok' | 'ollama';
  apiKey?: string;
  model: string;
  endpoint?: string;
}

interface AISettings {
  providers: {
    openai: AIProvider;
    anthropic: AIProvider;
    grok: AIProvider;
    ollama: AIProvider;
  };
  defaultProvider: AIProvider['name'];
  streamingEnabled: boolean;
  saveHistory: boolean;
}

interface AIContextType {
  settings: AISettings;
  updateProvider: (name: AIProvider['name'], updates: Partial<AIProvider>) => void;
  updateSettings: (updates: Partial<AISettings>) => void;
}

const defaultSettings: AISettings = {
  providers: {
    openai: {
      name: 'openai',
      model: 'gpt-4-turbo',
    },
    anthropic: {
      name: 'anthropic',
      model: 'claude-3-opus',
    },
    grok: {
      name: 'grok',
      model: 'grok-1',
    },
    ollama: {
      name: 'ollama',
      model: 'llama2',
      endpoint: 'http://localhost:11434',
    },
  },
  defaultProvider: 'openai',
  streamingEnabled: true,
  saveHistory: true,
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved AI settings:', e);
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateProvider = (name: AIProvider['name'], updates: Partial<AIProvider>) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [name]: {
          ...prev.providers[name],
          ...updates,
        },
      },
    }));
  };

  const updateSettings = (updates: Partial<AISettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <AIContext.Provider value={{ settings, updateProvider, updateSettings }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
