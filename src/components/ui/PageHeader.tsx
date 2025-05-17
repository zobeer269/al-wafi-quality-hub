
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backLink?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  backLink,
  primaryAction,
  secondaryAction,
  className,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={cn('mb-8', className)}>
      {backLink && (
        <Button 
          variant="ghost" 
          className="mb-2 p-0 hover:bg-transparent" 
          onClick={() => navigate(backLink)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          <span className="text-sm">Back</span>
        </Button>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="flex items-center gap-2"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="default"
              onClick={primaryAction.onClick}
              className="flex items-center gap-2"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
