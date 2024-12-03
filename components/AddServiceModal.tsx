import React, { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import ServiceConfigForm from './ServiceConfigForm';

const serviceTypes = [
  {
    type: 'ai',
    name: 'AI Models',
    providers: [
      { id: 'openai', name: 'OpenAI' },
      { id: 'anthropic', name: 'Anthropic' },
      { id: 'ollama', name: 'Ollama' },
      { id: 'grok', name: 'Grok' },
    ],
  },
  {
    type: 'calendar',
    name: 'Calendar',
    providers: [
      { id: 'google_calendar', name: 'Google Calendar' },
      { id: 'outlook', name: 'Outlook Calendar' },
    ],
  },
  {
    type: 'email',
    name: 'Email',
    providers: [
      { id: 'gmail', name: 'Gmail' },
      { id: 'outlook', name: 'Outlook' },
    ],
  },
  {
    type: 'storage',
    name: 'Storage',
    providers: [
      { id: 'gdrive', name: 'Google Drive' },
      { id: 'dropbox', name: 'Dropbox' },
    ],
  },
  {
    type: 'task',
    name: 'Tasks',
    providers: [
      { id: 'notion', name: 'Notion' },
    ],
  },
];

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: string, provider: string, name: string, config: Record<string, string>) => void;
}

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [step, setStep] = useState<'type' | 'provider' | 'config'>('type');

  const handleAdd = (config: Record<string, string>) => {
    if (selectedType && selectedProvider && serviceName) {
      onAdd(selectedType, selectedProvider, serviceName, config);
      handleReset();
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedProvider(null);
    setServiceName('');
    setStep('type');
    onClose();
  };

  if (!isOpen) return null;

  const selectedTypeConfig = serviceTypes.find(t => t.type === selectedType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Service</h2>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          {(step === 'provider' || step === 'config') && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button
                onClick={() => {
                  setStep('type');
                  setSelectedType(null);
                }}
                className="hover:text-foreground"
              >
                Service Type
              </button>
              <span>/</span>
              {selectedTypeConfig && (
                <span className={step === 'provider' ? 'text-foreground' : ''}>
                  {selectedTypeConfig.name}
                </span>
              )}
              {step === 'config' && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => {
                      setStep('provider');
                      setSelectedProvider(null);
                    }}
                    className="hover:text-foreground"
                  >
                    Provider
                  </button>
                  <span>/</span>
                  <span className="text-foreground">Configuration</span>
                </>
              )}
            </div>
          )}

          {/* Service Type Selection */}
          {step === 'type' && (
            <div className="grid grid-cols-2 gap-4">
              {serviceTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => {
                    setSelectedType(type.type);
                    setStep('provider');
                  }}
                  className="p-4 rounded-xl border border-border hover:border-primary transition-colors text-left space-y-2"
                >
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.providers.length} providers
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Provider Selection */}
          {step === 'provider' && selectedTypeConfig && (
            <div className="grid grid-cols-2 gap-4">
              {selectedTypeConfig.providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    setServiceName(provider.name);
                    setStep('config');
                  }}
                  className="p-4 rounded-xl border border-border hover:border-primary transition-colors text-left"
                >
                  <h3 className="font-medium">{provider.name}</h3>
                </button>
              ))}
            </div>
          )}

          {/* Configuration */}
          {step === 'config' && selectedType && selectedProvider && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border"
                  placeholder="Enter service name"
                />
              </div>
              <ServiceConfigForm
                type={selectedType}
                provider={selectedProvider}
                onSubmit={handleAdd}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
