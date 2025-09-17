import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import Button from '../../../../platform/src/components/Button';

interface PropertyActionsProps {
  isSaved: boolean;
  onSave: () => void;
  onAddToCompare: () => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  isSaved,
  onSave,
  onAddToCompare
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        className={`${isSaved ? 'bg-sky-50 border-sky-200 text-sky-700' : ''}`}
      >
        <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
        {isSaved ? 'Saved' : 'Save'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddToCompare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compare
      </Button>
    </div>
  );
};
