import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateDistance } from '@/utils/geoUtils';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Instructor {
  id: string;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  specialization: string;
  experience: number;
  photos: string[];
}

interface SearchParams {
  zipCode: string;
  country: string;
  radius: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp?: number;
}

const Instructors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Log location state immediately
  console.log('Instructor page state:', {
    state: location.state,
    searchParams: location.state?.searchParams
  });

  // Parse and validate search params
  const searchLocation = useMemo(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    console.log('Search params:', { lat, lng, radius });

    if (!lat || !lng || !radius) {
      console.warn('Missing search parameters');
      return null;
    }

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radius: parseFloat(radius)
    };
  }, [searchParams]);

  // Fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('instructors')
          .select('*');

        if (error) throw error;

        console.log('Fetched instructors:', data?.length);
        setInstructors(data || []);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError('Failed to fetch instructors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Filter and sort instructors by distance
  const filteredInstructors = useMemo(() => {
    if (!searchLocation || !instructors.length) {
      console.log('No search location or instructors to filter');
      return [];
    }

    console.log('Filtering instructors with params:', searchLocation);

    const filtered = instructors
      .map(instructor => {
        if (!instructor.latitude || !instructor.longitude) {
          console.warn('Instructor missing coordinates:', instructor.id);
          return null;
        }

        const distance = calculateDistance(
          { latitude: searchLocation.latitude, longitude: searchLocation.longitude },
          { latitude: instructor.latitude, longitude: instructor.longitude }
        );

        return { ...instructor, distance };
      })
      .filter((instructor): instructor is (Instructor & { distance: number }) => {
        if (!instructor) return false;
        const withinRadius = instructor.distance <= searchLocation.radius;
        if (!withinRadius) {
          console.log(`Instructor ${instructor.id} outside radius:`, instructor.distance.toFixed(2), 'km');
        }
        return withinRadius;
      })
      .sort((a, b) => a.distance - b.distance);

    console.log('Filtered instructors:', filtered.length);
    return filtered;
  }, [instructors, searchLocation]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading instructors...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!searchLocation) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">No search criteria specified</h1>
          <p>Please try searching from the home page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Golf Instructors near {searchLocation.latitude}, {searchLocation.longitude}
        </h1>
        
        <div className="text-sm text-gray-600 mb-6">
          Showing {filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? 's' : ''} within {searchLocation.radius}km
          {instructors.length > filteredInstructors.length && (
            <div className="text-xs text-gray-500 mt-1">
              <p>
                {instructors.length - filteredInstructors.length} instructor{instructors.length - filteredInstructors.length !== 1 ? 's' : ''} excluded:
              </p>
              <ul className="list-disc list-inside ml-2">
                {instructors.some(i => !i.latitude || !i.longitude) && (
                  <li>Missing location data</li>
                )}
                {instructors.some(i => {
                  if (!i.latitude || !i.longitude) return false;
                  const distance = calculateDistance(searchLocation, {
                    latitude: Number(i.latitude),
                    longitude: Number(i.longitude)
                  });
                  return distance > searchLocation.radius;
                }) && (
                  <li>Outside {searchLocation.radius}km radius</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor) => {
              const distance = instructor.distance;
              
              return (
                <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{instructor.name}</h3>
                        <p className="text-sm text-gray-600">{instructor.location}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(distance * 10) / 10}km away
                        </p>
                      </div>
                      {instructor.photos?.[0] && (
                        <img 
                          src={instructor.photos[0]} 
                          alt={instructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Specialization:</span> {instructor.specialization}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Experience:</span> {instructor.experience} years
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No instructors found within {searchLocation.radius}km of this location.</p>
              <p className="text-sm text-gray-500 mt-2">Try increasing your search radius or searching in a different area.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Instructors;
