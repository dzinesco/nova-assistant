import React from 'react';
import { IconType } from 'react-icons';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  gradient,
  onClick
}) => {
  return (
    <Card title={title} icon={Icon} gradient={gradient} onClick={onClick}>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-100">{value}</div>
          {trend && (
            <div className={`flex items-center mt-2 text-sm
                          ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <svg
                className={`w-4 h-4 ml-1 ${
                  trend.isPositive ? 'transform rotate-180' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
