import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../../platform/src/components/Button';
import { PropertyViewProps } from '../types';
import { usePropertyManagement } from '../hooks/usePropertyManagement';
import { usePropertyData } from '../hooks/usePropertyData';
import { PropertyImageGallery } from './PropertyImageGallery';
import { PropertyDetailsPanel } from './PropertyDetailsPanel';
import { AgentCard } from './AgentCard';
import { SimilarPropertiesList } from './SimilarPropertiesList';
import { SuburbContextPanel } from './SuburbContextPanel';
import { PropertyActions } from './PropertyActions';
import { PropertyMeta } from './PropertyMeta';
import { SchoolCatchments } from './SchoolCatchments';
import { MobileActionBar } from './MobileActionBar';

export const PropertyView: React.FC<PropertyViewProps> = ({
  propertyId,
  onBack,
  onViewSuburb,
  onAddToCompare,
  onSaveProperty
}) => {
  const { 
    currentImageIndex,
    showFullDescription,
    isSaved,
    imageLoadingStates,
    imageLoadedStates,
    blurPlaceholders,
    nextImage,
    prevImage,
    goToImage,
    handleImageLoad,
    handleImageError,
    handleSave,
    handleCallAgent,
    handleEmailAgent,
    initializeImageStates,
    setShowFullDescription
  } = usePropertyManagement();

  const { 
    property, 
    similarProperties, 
    loading, 
    error, 
    daysAgo 
  } = usePropertyData(propertyId);

  // Initialize image states when property loads
  React.useEffect(() => {
    if (property?.images) {
      initializeImageStates(property.images.length);
    }
  }, [property?.images, initializeImageStates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleSaveProperty = () => {
    handleSave();
    onSaveProperty(property.id);
  };

  const handleAddToCompare = () => {
    onAddToCompare(property);
  };

  const handleViewSuburb = () => {
    onViewSuburb(property.suburbId);
  };

  const handleCallAgentProperty = () => {
    handleCallAgent(property.agent.phone);
  };

  const handleEmailAgentProperty = () => {
    handleEmailAgent(property.agent.email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
              <h1 className="text-lg font-medium text-gray-900 truncate">
                {property.title}
              </h1>
            </div>
            
            <PropertyActions
              isSaved={isSaved}
              onSave={handleSaveProperty}
              onAddToCompare={handleAddToCompare}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <PropertyImageGallery
              images={property.images}
              currentImageIndex={currentImageIndex}
              imageLoadingStates={imageLoadingStates}
              imageLoadedStates={imageLoadedStates}
              blurPlaceholders={blurPlaceholders}
              onNext={nextImage}
              onPrev={prevImage}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
              onImageSelect={goToImage}
            />

            {/* Property Details Panel */}
            <PropertyDetailsPanel
              property={property}
              showFullDescription={showFullDescription}
              onToggleDescription={handleToggleDescription}
              daysAgo={daysAgo}
            />

            {/* Similar Properties */}
            <SimilarPropertiesList
              similarProperties={similarProperties}
              suburbName={property.suburb}
            />
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
            {/* Suburb Context Panel */}
            <SuburbContextPanel
              property={property}
              onViewSuburb={handleViewSuburb}
            />

            {/* Agent Card */}
            <AgentCard
              agent={property.agent}
              onCallAgent={handleCallAgentProperty}
              onEmailAgent={handleEmailAgentProperty}
            />

            {/* Property Meta */}
            <PropertyMeta property={property} />

            {/* School Catchments */}
            <SchoolCatchments property={property} />
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <MobileActionBar
        isSaved={isSaved}
        onSave={handleSaveProperty}
        onCallAgent={handleCallAgentProperty}
        onAddToCompare={handleAddToCompare}
      />
    </div>
  );
};
