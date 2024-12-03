import React, { useState } from 'react';
import { useServices } from '../contexts/ServicesContext';
import { RiAddLine } from 'react-icons/ri';
import AddServiceModal from '../components/AddServiceModal';

export default function Settings() {
  const { services, addService, removeService, updateService } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddService = (
    type: string,
    provider: string,
    name: string,
    config: Record<string, string>
  ) => {
    addService({
      name,
      type,
      provider,
      status: 'connected',
      lastSync: new Date().toISOString(),
      config,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <RiAddLine className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-xl border bg-card text-card-foreground"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.provider} - {service.type}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    service.status === 'connected'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {service.status}
                </span>
                <button
                  onClick={() => removeService(service.id)}
                  className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    updateService(service.id, { name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border"
                />
              </div>
              {service.lastSync && (
                <p className="text-sm text-muted-foreground">
                  Last synced: {new Date(service.lastSync).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddService}
      />
    </div>
  );
}
