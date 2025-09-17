import { useState, useCallback } from 'react';
// Removed unused import

export const usePropertyManagement = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const [imageLoadedStates, setImageLoadedStates] = useState<boolean[]>([]);
  const [blurPlaceholders, setBlurPlaceholders] = useState<string[]>([]);

  // Image navigation
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => prev + 1);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => prev - 1);
  }, []);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Image loading management
  const handleImageLoad = useCallback((index: number) => {
    setImageLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
    setImageLoadedStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  }, []);

  const handleImageError = useCallback((index: number) => {
    setImageLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
    // Set a placeholder for failed images
    setBlurPlaceholders(prev => {
      const newPlaceholders = [...prev];
      newPlaceholders[index] = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
      return newPlaceholders;
    });
  }, []);

  // Property actions
  const handleSave = useCallback(() => {
    setIsSaved(prev => !prev);
  }, []);

  const handleCallAgent = useCallback((phone: string) => {
    window.open(`tel:${phone}`, '_self');
  }, []);

  const handleEmailAgent = useCallback((email: string) => {
    window.open(`mailto:${email}`, '_self');
  }, []);

  // Initialize image states
  const initializeImageStates = useCallback((imageCount: number) => {
    setImageLoadingStates(new Array(imageCount).fill(true));
    setImageLoadedStates(new Array(imageCount).fill(false));
    setBlurPlaceholders(new Array(imageCount).fill(''));
  }, []);

  return {
    // State
    currentImageIndex,
    showFullDescription,
    isSaved,
    imageLoadingStates,
    imageLoadedStates,
    blurPlaceholders,
    
    // Actions
    nextImage,
    prevImage,
    goToImage,
    handleImageLoad,
    handleImageError,
    handleSave,
    handleCallAgent,
    handleEmailAgent,
    initializeImageStates,
    
    // Setters
    setShowFullDescription,
  };
};
