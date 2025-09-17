import { useState, useEffect, useMemo } from 'react';
import { PropertyDetail } from '../types';

interface SimilarProperty {
  id: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  propertyType: string;
}

export const usePropertyData = (propertyId: string) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock property data - in real app this would come from API
  const mockProperty: PropertyDetail = useMemo(() => ({
    id: propertyId,
    title: 'Modern 3-Bedroom House with Ocean Views',
    price: 1250000,
    priceDisplay: '$1,250,000',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop'
    ],
    beds: 3,
    baths: 2,
    parking: 2,
    propertyType: 'house',
    landSize: 450,
    internalSize: 180,
    suburbScore: 85,
    yieldEstimate: 4.2,
    priceVsMedian: -5,
    daysOnMarket: 12,
    address: '123 Ocean Drive',
    suburb: 'Brunswick',
    suburbId: 'brunswick-3056',
    description: 'Stunning modern family home with breathtaking ocean views. This beautifully designed 3-bedroom, 2-bathroom house features an open-plan living area, gourmet kitchen with stone benchtops, and a private outdoor entertaining space. The master bedroom includes a walk-in wardrobe and ensuite, while the additional bedrooms offer built-in storage. Located in a highly sought-after suburb with excellent schools, transport, and amenities nearby. Don\'t miss this opportunity to secure your dream home in one of Melbourne\'s most desirable locations.',
    features: [
      'Ocean views',
      'Open plan living',
      'Gourmet kitchen',
      'Stone benchtops',
      'Walk-in wardrobe',
      'Built-in storage',
      'Outdoor entertaining',
      'Double garage',
      'Solar panels',
      'Smart home features'
    ],
    listingDate: '2024-12-01',
    listingId: 'PROP-2024-001',
    status: 'for-sale' as const,
    agent: {
      name: 'Sarah Johnson',
      agency: 'Coastal Real Estate',
      phone: '+61 3 9123 4567',
      email: 'sarah.johnson@coastalrealestate.com.au',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    lastSaleDate: '2019-03-15',
    lastSalePrice: 980000,
    schoolCatchments: {
      primary: 'Brunswick Primary School',
      secondary: 'Brunswick Secondary College'
    },
    zoning: 'Residential Zone 1',
    nbn: 'FTTP',
    hazards: ['Bushfire prone area']
  }), [propertyId]);

  // Mock similar properties data
  const similarProperties: SimilarProperty[] = useMemo(() => [
    {
      id: 'prop-2',
      title: 'Charming 3-Bedroom Cottage',
      price: 1150000,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      beds: 3,
      baths: 1,
      propertyType: 'house'
    },
    {
      id: 'prop-3',
      title: 'Modern 2-Bedroom Apartment',
      price: 750000,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      beds: 2,
      baths: 2,
      propertyType: 'apartment'
    },
    {
      id: 'prop-4',
      title: 'Family 4-Bedroom Home',
      price: 1350000,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      beds: 4,
      baths: 3,
      propertyType: 'house'
    }
  ], []);

  // Calculate days ago
  const daysAgo = useMemo(() => {
    if (!property) return 0;
    const listingDate = new Date(property.listingDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - listingDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [property]);

  useEffect(() => {
    // Simulate API call
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProperty(mockProperty);
        setError(null);
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, mockProperty]);

  return {
    property,
    similarProperties,
    loading,
    error,
    daysAgo
  };
};
