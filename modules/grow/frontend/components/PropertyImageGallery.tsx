import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  imageLoadingStates: boolean[];
  imageLoadedStates: boolean[];
  blurPlaceholders: string[];
  onNext: () => void;
  onPrev: () => void;
  onImageLoad: (index: number) => void;
  onImageError: (index: number) => void;
  onImageSelect: (index: number) => void;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  currentImageIndex,
  imageLoadingStates,
  imageLoadedStates,
  blurPlaceholders,
  onNext,
  onPrev,
  onImageLoad,
  onImageError,
  onImageSelect
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative aspect-[4/3] bg-gray-100">
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">No images available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-100">
        {/* Blur-up placeholder */}
        {blurPlaceholders[currentImageIndex] && (
          <img
            src={blurPlaceholders[currentImageIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
            style={{ transform: 'scale(1.1)' }}
          />
        )}
        
        {/* Skeleton placeholder while loading */}
        {imageLoadingStates[currentImageIndex] && (
          <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
        
        {/* Actual image */}
        <img
          src={images[currentImageIndex]}
          alt={`Property image ${currentImageIndex + 1}`}
          className={`relative w-full h-full object-cover transition-opacity duration-300 ${
            imageLoadedStates[currentImageIndex] ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => onImageLoad(currentImageIndex)}
          onError={() => onImageError(currentImageIndex)}
          loading="lazy"
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="p-4 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-sky-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
