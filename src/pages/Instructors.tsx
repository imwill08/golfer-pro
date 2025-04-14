import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchParams {
  zipCode: string;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  filteredGolfers: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
  }>;
}

const Instructors = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
    }
  }, [location]);

  if (!searchParams) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">No search results found</h1>
        <p>Please try searching again from the home page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Golf Instructors near {searchParams.zipCode}
      </h1>
      
      {searchParams.category && (
        <p className="text-gray-600 mb-6">
          Category: {searchParams.category}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchParams.filteredGolfers.map((golfer) => (
          <Card key={golfer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{golfer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Category: {golfer.category}</p>
              <p className="text-gray-600">
                Distance: {Math.round(calculateDistance(searchParams.coordinates, {
                  latitude: golfer.latitude,
                  longitude: golfer.longitude
                }) * 100) / 100} km
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchParams.filteredGolfers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No instructors found in this area.</p>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate distance (you can move this to geoUtils.ts if needed)
const calculateDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(point1.latitude)) * Math.cos(toRad(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

export default Instructors; 