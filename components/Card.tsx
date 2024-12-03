import React from 'react';
import { IconType } from 'react-icons';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: IconType;
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'yellow' | 'indigo' | 'teal';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  icon: Icon,
  variant = 'primary',
  color = 'blue',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl p-6
        backdrop-blur-lg
        transition-all duration-300
        ${`neon-${color}`}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
      `}
      style={{
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: `var(--card-${color})`,
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(135deg, var(--card-${color}), transparent)`,
          opacity: 0.15,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sys-label">
            {title}
          </h3>
          {Icon && (
            <div style={{ color: `var(--card-${color})` }}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="text-sys-label-secondary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
