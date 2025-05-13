
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
  onClick,
}) => {
  return (
    <Card 
      className={cn('card-hover', onClick && 'cursor-pointer', className)} 
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon && <div className="text-qms-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
        {change && (
          <p className={cn(
            'text-xs mt-1',
            change.trend === 'up' ? 'text-qms-success' : 
            change.trend === 'down' ? 'text-qms-danger' : 'text-qms-gray'
          )}>
            {change.trend === 'up' && '↑ '}
            {change.trend === 'down' && '↓ '}
            {change.value}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
