import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'purple' | 'blue' | 'green' | 'indigo';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className = '',
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white',
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    indigo: 'bg-indigo-50 border-indigo-200',
  };

  return (
    <div className={`rounded-2xl shadow-2xl p-6 ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
