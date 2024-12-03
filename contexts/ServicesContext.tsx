import React, { createContext, useContext, useState, useCallback } from 'react';

type Service = {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
};

type ServicesContextType = {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  const addService = useCallback((service: Omit<Service, 'id'>) => {
    const newService = {
      ...service,
      id: Math.random().toString(36).substring(7),
    };
    setServices(prev => [...prev, newService]);
  }, []);

  const removeService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, ...updates } : service
      )
    );
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        removeService,
        updateService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
