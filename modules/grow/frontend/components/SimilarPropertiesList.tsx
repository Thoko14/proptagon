import React from 'react';
// Removed unused import

interface SimilarProperty {
  id: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  propertyType: string;
}

interface SimilarPropertiesListProps {
  similarProperties: SimilarProperty[];
  suburbName: string;
}

export const SimilarPropertiesList: React.FC<SimilarPropertiesListProps> = ({
  similarProperties,
  suburbName
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (similarProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar in {suburbName}</h3>
        <div className="text-gray-500 text-center py-8">
          No similar properties found in this suburb
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar in {suburbName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {similarProperties.map((prop) => (
          <div key={prop.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img
              src={prop.image}
              alt={prop.title}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">{prop.title}</h4>
              <div className="text-lg font-bold text-gray-900 mb-2">
                {formatPrice(prop.price)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{prop.beds} beds</span>
                <span>{prop.baths} baths</span>
                <span className="capitalize">{prop.propertyType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
