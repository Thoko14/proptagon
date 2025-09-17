import React from 'react';
import { PropertyDetail } from '../types';

interface SchoolCatchmentsProps {
  property: PropertyDetail;
}

export const SchoolCatchments: React.FC<SchoolCatchmentsProps> = ({ property }) => {
  if (!property.schoolCatchments) {
    return null;
  }

  const { primary, secondary } = property.schoolCatchments;

  if (!primary && !secondary) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">School Catchments</h3>
      <div className="space-y-3">
        {primary && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Primary</span>
            <span className="text-sm text-gray-900">{primary}</span>
          </div>
        )}
        {secondary && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Secondary</span>
            <span className="text-sm text-gray-900">{secondary}</span>
          </div>
        )}
      </div>
    </div>
  );
};
