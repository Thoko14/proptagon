import React from 'react';
import { Phone, Heart, Share2 } from 'lucide-react';
import Button from '../../../../platform/src/components/Button';

interface MobileActionBarProps {
  isSaved: boolean;
  onSave: () => void;
  onCallAgent: () => void;
  onAddToCompare: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  isSaved,
  onSave,
  onCallAgent,
  onAddToCompare
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCallAgent}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Agent
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={onSave}
        >
          <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onAddToCompare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compare
        </Button>
      </div>
    </div>
  );
};
