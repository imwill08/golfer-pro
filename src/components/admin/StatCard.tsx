
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  change?: {
    value: string;
    positive: boolean;
  };
}

const StatCard = ({ title, value, icon: Icon, iconColor, change }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <div 
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconColor || "bg-blue-100 text-blue-500"
          )}
        >
          <Icon size={20} />
        </div>
      </div>
      
      <div className="text-2xl font-bold mb-2">{value}</div>
      
      {change && (
        <div className="flex items-center">
          <span 
            className={cn(
              "text-sm font-medium",
              change.positive ? "text-green-500" : "text-red-500"
            )}
          >
            {change.positive ? '+' : ''}{change.value}
          </span>
          <span className="text-gray-500 text-sm ml-1">vs. last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
