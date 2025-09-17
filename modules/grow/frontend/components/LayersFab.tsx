import React from 'react';

interface LayersFabProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const LayersFab: React.FC<LayersFabProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-3 text-white rounded-md shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Open school catchments controls"
      style={{
        backgroundColor: '#2563eb', // blue-600
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1d4ed8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2563eb';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.backgroundColor = '#1e40af';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.backgroundColor = '#1d4ed8';
      }}
    >
      <span className="text-sm font-medium text-white">🎓 School catchments</span>
    </button>
  );
};
