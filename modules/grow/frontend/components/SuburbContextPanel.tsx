import React from 'react';
import { MapPin } from 'lucide-react';
import Button from '../../../../platform/src/components/Button';
import { PropertyDetail } from '../types';

interface SuburbContextPanelProps {
  property: PropertyDetail;
  onViewSuburb: (suburbId: string) => void;
}

export const SuburbContextPanel: React.FC<SuburbContextPanelProps> = ({
  property,
  onViewSuburb
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Suburb Context</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Suburb Score</span>
          <span className={`font-semibold ${getScoreColor(property.suburbScore)}`}>
            {property.suburbScore}/100
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Gross Rental Yield</span>
          <span className="font-semibold text-gray-900">{property.yieldEstimate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">5-Year Growth</span>
          <span className="font-semibold text-gray-900">8.5%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Median Price</span>
          <span className="font-semibold text-gray-900">$1.3M</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Stock on Market</span>
          <span className="font-semibold text-gray-900">45</span>
        </div>
      </div>
      
      <Button
        variant="primary"
        size="sm"
        className="w-full mt-4"
        onClick={() => onViewSuburb(property.suburbId)}
      >
        <MapPin className="w-4 h-4 mr-2" />
        View Suburb on Map
      </Button>
    </div>
  );
};
