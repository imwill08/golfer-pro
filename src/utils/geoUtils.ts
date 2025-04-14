import axios from 'axios';

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Function to convert zip code to coordinates using a geocoding service
export const getCoordinatesFromZip = async (zipCode: string): Promise<Coordinates | null> => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${zipCode}&country=US`);
    if (response.data && response.data[0]) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

// Function to calculate distance between two points in kilometers
export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
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

// Function to filter golfers within a certain radius
export const filterGolfersByDistance = (
  golfers: any[],
  centerCoordinates: Coordinates,
  maxDistanceKm: number
): any[] => {
  return golfers.filter(golfer => {
    const golferCoordinates = {
      latitude: golfer.latitude,
      longitude: golfer.longitude
    };
    const distance = calculateDistance(centerCoordinates, golferCoordinates);
    return distance <= maxDistanceKm;
  });
}; 