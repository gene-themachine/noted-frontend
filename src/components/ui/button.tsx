import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default',
  size = 'default',
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    primary: 'bg-primary-button text-primary-button-foreground hover:bg-primary-button-hover',
    secondary: 'bg-secondary-button text-secondary-button-foreground hover:bg-secondary-button-hover',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    icon: 'h-10 w-10'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}; 