import React from 'react';

interface SchoolCatchmentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * School Catchments Sidebar Component
 * TODO: Re-implement with proper types after merge is complete
 */
export const SchoolCatchmentsSidebar: React.FC<SchoolCatchmentsSidebarProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">School Catchments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>This component is temporarily disabled due to complex type issues.</p>
          <p className="mt-2">It will be re-implemented after the merge is complete.</p>
        </div>
      </div>
    </div>
  );
};