import React from 'react';
import { cn } from '../../utils/classUtils';

interface NavigationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  children,
  onClick,
  title,
  className,
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg hover:bg-black/10 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        className,
      )}
    >
      {children}
    </button>
  );
};
