import React from 'react';
import { FiMail, FiCalendar, FiCpu, FiHardDrive, FiCheckCircle, FiAlertCircle, FiSettings, FiTrash2, FiList } from 'react-icons/fi';
import { ServiceType, ServiceStatus, ServiceConfig } from '../contexts/ServicesContext';

interface ServiceCardProps {
  service: ServiceConfig;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const serviceIcons: Record<ServiceType, React.ElementType> = {
  email: FiMail,
  calendar: FiCalendar,
  ai: FiCpu,
  storage: FiHardDrive,
  task: FiList,
};

const statusColors: Record<ServiceStatus, string> = {
  connected: 'text-green-500',
  disconnected: 'text-gray-400',
  error: 'text-red-500',
  configuring: 'text-blue-500',
};

const serviceColors: Record<ServiceType, string> = {
  email: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  calendar: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  ai: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  storage: 'from-green-500/20 to-green-600/20 border-green-500/30',
  task: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
};

export default function ServiceCard({ service, isActive, onSelect, onRemove }: ServiceCardProps) {
  const Icon = serviceIcons[service.type];

  return (
    <div
      className={`
        relative p-4 rounded-xl border bg-gradient-to-br cursor-pointer
        transition-all duration-200 group
        ${serviceColors[service.type]}
        ${isActive ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01] hover:shadow-md'}
      `}
      onClick={onSelect}
    >
      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 rounded-lg hover:bg-sys-fill/50 text-sys-label"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-sys-fill/50 ${statusColors[service.status]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium truncate">{service.name}</h3>
            {service.status === 'connected' && (
              <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
            {service.status === 'error' && (
              <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-sys-label/70">
            {service.provider.charAt(0).toUpperCase() + service.provider.slice(1).replace('_', ' ')}
          </p>
          {service.lastSync && (
            <p className="text-xs text-sys-label/50 mt-2">
              Last synced: {new Date(service.lastSync).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {service.error && (
        <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500">
          {service.error}
        </div>
      )}
    </div>
  );
}
