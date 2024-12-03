import React from 'react';
import Image from 'next/image';
import Card from './Card';
import { RiCheckLine, RiCloseLine, RiErrorWarningLine } from 'react-icons/ri';

interface Service {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

interface ConnectedServicesProps {
  services: Service[];
  onConnect: (serviceId: string) => void;
}

const StatusIcon = {
  connected: RiCheckLine,
  disconnected: RiCloseLine,
  error: RiErrorWarningLine,
};

const StatusColor = {
  connected: 'text-green-400 bg-green-400/10',
  disconnected: 'text-gray-400 bg-gray-400/10',
  error: 'text-red-400 bg-red-400/10',
};

const ConnectedServices: React.FC<ConnectedServicesProps> = ({
  services,
  onConnect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        const StatusIconComponent = StatusIcon[service.status];
        const statusColorClass = StatusColor[service.status];

        return (
          <Card
            key={service.id}
            title={service.name}
            onClick={() => service.status !== 'connected' && onConnect(service.id)}
            gradient={
              service.status === 'connected'
                ? 'from-green-500/20 to-emerald-500/20'
                : undefined
            }
          >
            <div className="flex items-center justify-between">
              {/* Service Logo */}
              <div className="relative w-8 h-8">
                <Image
                  src={service.logo}
                  alt={service.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>

              {/* Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full
                           ${statusColorClass}`}>
                <StatusIconComponent className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">
                  {service.status}
                </span>
              </div>
            </div>

            {/* Last Sync Time */}
            {service.lastSync && service.status === 'connected' && (
              <p className="mt-2 text-xs text-gray-400">
                Last synced: {service.lastSync.toLocaleDateString()}
              </p>
            )}

            {/* Connect Button */}
            {service.status !== 'connected' && (
              <button
                onClick={() => onConnect(service.id)}
                className="mt-4 w-full px-4 py-2 text-sm font-medium
                         bg-primary-500/10 text-primary-400
                         rounded-lg border border-primary-500/20
                         hover:bg-primary-500/20 transition-colors duration-200"
              >
                Connect {service.name}
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ConnectedServices;
