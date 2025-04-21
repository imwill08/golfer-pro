
import React from 'react';

interface LoadingErrorStateProps {
  isLoading: boolean;
  error?: string;
  children: React.ReactNode;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({ 
  isLoading, 
  error,
  children 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-golf-blue border-r-transparent"></div>
        <p className="mt-2">Loading instructor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingErrorState;
