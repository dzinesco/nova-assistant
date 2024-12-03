import React, { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
}

const serviceConfigs: Record<string, Record<string, ConfigField[]>> = {
  ai: {
    openai: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        helperText: 'Find your API key in the OpenAI dashboard',
      },
      {
        key: 'model',
        label: 'Default Model',
        type: 'select',
        options: [
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        ],
        required: true,
      },
    ],
    anthropic: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        helperText: 'Find your API key in the Anthropic console',
      },
      {
        key: 'model',
        label: 'Default Model',
        type: 'select',
        options: [
          { value: 'claude-3-opus', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
          { value: 'claude-2.1', label: 'Claude 2.1' },
        ],
        required: true,
      },
    ],
    ollama: [
      {
        key: 'endpoint',
        label: 'API Endpoint',
        type: 'text',
        placeholder: 'http://localhost:11434',
        required: true,
        helperText: 'Your Ollama server endpoint',
      },
      {
        key: 'model',
        label: 'Default Model',
        type: 'text',
        placeholder: 'llama2',
        required: true,
        helperText: 'Name of the model to use',
      },
    ],
  },
  calendar: {
    google_calendar: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        helperText: 'From Google Cloud Console',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        helperText: 'From Google Cloud Console',
      },
    ],
    outlook: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        helperText: 'From Microsoft Azure Portal',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        helperText: 'From Microsoft Azure Portal',
      },
    ],
  },
  email: {
    gmail: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        helperText: 'From Google Cloud Console',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        helperText: 'From Google Cloud Console',
      },
    ],
    outlook: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        helperText: 'From Microsoft Azure Portal',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        helperText: 'From Microsoft Azure Portal',
      },
    ],
  },
  storage: {
    gdrive: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        required: true,
        helperText: 'From Google Cloud Console',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        helperText: 'From Google Cloud Console',
      },
    ],
    dropbox: [
      {
        key: 'appKey',
        label: 'App Key',
        type: 'text',
        required: true,
        helperText: 'From Dropbox Developer Console',
      },
      {
        key: 'appSecret',
        label: 'App Secret',
        type: 'password',
        required: true,
        helperText: 'From Dropbox Developer Console',
      },
    ],
  },
  task: {
    notion: [
      {
        key: 'apiKey',
        label: 'Integration Token',
        type: 'password',
        required: true,
        helperText: 'From Notion Integrations page',
      },
    ],
  },
};

interface ServiceConfigFormProps {
  type: string;
  provider: string;
  onSubmit: (config: Record<string, string>) => void;
}

export default function ServiceConfigForm({
  type,
  provider,
  onSubmit,
}: ServiceConfigFormProps) {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const fields = serviceConfigs[type]?.[provider] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isValid = fields.every(field => 
    !field.required || (config[field.key] && config[field.key].trim() !== '')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            {field.type === 'select' ? (
              <select
                value={config[field.key] || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type={
                    field.type === 'password' && !showPasswords[field.key]
                      ? 'password'
                      : 'text'
                  }
                  value={config[field.key] || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border"
                  required={field.required}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords[field.key] ? (
                      <RiEyeOffLine className="w-4 h-4" />
                    ) : (
                      <RiEyeLine className="w-4 h-4" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
          {field.helperText && (
            <p className="text-sm text-muted-foreground mt-1">{field.helperText}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Service
      </button>
    </form>
  );
}
