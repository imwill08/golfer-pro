import axios from 'axios';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationEntity {
  id: string;
  latitude: number;
  longitude: number;
  country?: string;
  [key: string]: any;
}

export interface ZipValidationResult {
  isValid: boolean;
  error?: string;
}

// Simple rate limiter implementation to ensure we don't exceed Nominatim's rate limits
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second in milliseconds

/**
 * Ensures requests to Nominatim API don't exceed 1 per second
 */
const rateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    // Wait for the remaining time to complete 1 second
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
};

/**
 * Converts a zip code to coordinates using OpenStreetMap's Nominatim API
 * @param zipCode - The postal code to geocode
 * @param country - Optional country to improve accuracy
 * @param state - Optional state/province to improve accuracy
 * @param city - Optional city to improve accuracy
 * @returns Promise resolving to coordinates or null if not found
 */
export const getCoordinatesFromZip = async (
  zipCode: string, 
  country?: string, 
  state?: string, 
  city?: string
): Promise<Coordinates | null> => {
  try {
    console.log('getCoordinatesFromZip called with:', { zipCode, country, state, city });
    
    // Apply rate limiting before making the request
    await rateLimit();
    
    let url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${zipCode}&limit=1`;
    
    // Add optional parameters if provided
    if (country) {
      url += `&country=${encodeURIComponent(country)}`;
    }
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    if (city) {
      url += `&city=${encodeURIComponent(city)}`;
    }
    
    console.log('Making request to Nominatim API:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GolfProFinder/1.0 (https://golfprofinder.com)',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 5000 // 5 second timeout
    });
    
    console.log('Nominatim API response:', response.data);
    
    // Guard against empty response
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log('No results from Nominatim API');
      
      // Try fallback search if we have additional location info
      if (city || state || country) {
        return await fallbackLocationSearch(zipCode, country, state, city);
      }
      
      return null;
    }
    
    const coordinates = {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon)
    };

    // Validate parsed coordinates
    if (isNaN(coordinates.latitude) || isNaN(coordinates.longitude)) {
      console.error('Invalid coordinates received:', response.data[0]);
      return null;
    }

    console.log('Found coordinates:', coordinates);
    return coordinates;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw new Error('Location search timed out. Please try again.');
    }
    throw new Error('Failed to get location coordinates. Please try again.');
  }
};

/**
 * Fallback search using full address when postal code search fails
 */
const fallbackLocationSearch = async (
  zipCode: string,
  country?: string,
  state?: string,
  city?: string
): Promise<Coordinates | null> => {
  try {
    await rateLimit();
    
    let searchQuery = [city, state, country, zipCode].filter(Boolean).join(', ');
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
    console.log('Making fallback request:', fallbackUrl);
    
    const fallbackResponse = await axios.get(fallbackUrl, {
      headers: {
        'User-Agent': 'GolfProFinder/1.0 (https://golfprofinder.com)',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 5000
    });
    
    if (!fallbackResponse.data?.[0]?.lat || !fallbackResponse.data?.[0]?.lon) {
      return null;
    }
    
    const coordinates = {
      latitude: parseFloat(fallbackResponse.data[0].lat),
      longitude: parseFloat(fallbackResponse.data[0].lon)
    };

    if (isNaN(coordinates.latitude) || isNaN(coordinates.longitude)) {
      return null;
    }

    console.log('Found coordinates from fallback:', coordinates);
    return coordinates;
  } catch (error) {
    console.error('Fallback search error:', error);
    return null;
  }
};

/**
 * Converts degrees to radians with enhanced logging
 */
const toRad = (deg: number): number => {
  const rad = deg * (Math.PI / 180);
  console.log(`🔄 ${deg}° → ${rad.toFixed(6)} rad`);
  return rad;
};

/**
 * Converts kilometers to miles
 * @param km - Distance in kilometers
 * @returns Distance in miles
 */
export const kmToMiles = (km: number): number => km * 0.621371;

/**
 * Converts miles to kilometers
 * @param miles - Distance in miles
 * @returns Distance in kilometers
 */
export const milesToKm = (miles: number): number => miles * 1.60934;

/**
 * Calculates the distance between two points using the Haversine formula
 */
export const calculateDistance = (p1: Coordinates, p2: Coordinates): number => {
  console.group(`🧮 Haversine: ${p1.latitude},${p1.longitude} → ${p2.latitude},${p2.longitude}`);
  const toRad = (d: number) => d * (Math.PI/180);

  const dLat = toRad(p2.latitude - p1.latitude);
  const dLon = toRad(p2.longitude - p1.longitude);
  console.log('   Δlat, Δlon (rad):', dLat.toFixed(6), dLon.toFixed(6));

  const a = Math.sin(dLat/2)**2 +
           Math.cos(toRad(p1.latitude)) *
           Math.cos(toRad(p2.latitude)) *
           Math.sin(dLon/2)**2;
  console.log('   a:', a.toFixed(6));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log('   c:', c.toFixed(6));

  const R = 3958.8; // Earth's radius in miles
  const dist = R * c;
  console.log('   distance:', dist.toFixed(2), 'miles');
  console.groupEnd();

  return dist;
};

/**
 * Pre-filters entities using a bounding box before precise distance calculation
 */
const isWithinBoundingBox = (
  point: Coordinates,
  center: Coordinates,
  radiusMiles: number
): boolean => {
  const lat = typeof point.latitude === 'string' ? parseFloat(point.latitude) : point.latitude;
  const lon = typeof point.longitude === 'string' ? parseFloat(point.longitude) : point.longitude;
  const centerLat = typeof center.latitude === 'string' ? parseFloat(center.latitude) : center.latitude;
  const centerLon = typeof center.longitude === 'string' ? parseFloat(center.longitude) : center.longitude;

  const dLat = radiusMiles / 69; // ~miles per degree latitude
  const dLon = radiusMiles / (69 * Math.cos(toRad(centerLat)));

  const withinBox = 
    Math.abs(lat - centerLat) <= dLat &&
    Math.abs(lon - centerLon) <= dLon;

  console.log('Bounding box check:', {
    point: { lat, lon },
    center: { lat: centerLat, lon: centerLon },
    dLat,
    dLon,
    withinBox
  });

  return withinBox;
};

/**
 * Filters entities by distance from a center point
 */
export const filterByDistance = <T extends LocationEntity>(
  entities: T[],
  centerCoordinates: Coordinates,
  maxDistanceMiles: number
): T[] => {
  console.log('Starting distance filtering:', {
    totalEntities: entities.length,
    centerCoordinates,
    maxDistanceMiles
  });

  const filtered = entities.filter(entity => {
    // Skip entities without valid coordinates
    if (!entity.latitude || !entity.longitude) {
      console.log(`Instructor ${entity.id}: SKIPPED - missing coordinates`);
      return false;
    }

    const entityCoords = {
      latitude: entity.latitude,
      longitude: entity.longitude
    };

    // First check bounding box
    if (!isWithinBoundingBox(entityCoords, centerCoordinates, maxDistanceMiles)) {
      console.log(`Instructor ${entity.id}: SKIPPED - outside bounding box`);
      return false;
    }

    // Calculate precise distance
    const distance = calculateDistance(centerCoordinates, entityCoords);
    const isWithinRange = distance <= maxDistanceMiles;

    console.log(`Instructor ${entity.id}:`, {
      coordinates: [entity.latitude, entity.longitude],
      distance: distance.toFixed(2) + ' miles',
      maxDistance: maxDistanceMiles + ' miles',
      withinRange: isWithinRange
    });

    return isWithinRange;
  });

  console.log(`Filtering complete: ${filtered.length} of ${entities.length} instructors within range`);
  return filtered;
};

/**
 * Validates zip/postal code format based on country
 * @param zipCode - The postal code to validate
 * @param country - The country code (e.g., 'USA', 'IN', etc.)
 * @returns Validation result with error message if invalid
 */
export const validateZipCode = (zipCode: string, country: string): ZipValidationResult => {
  if (!zipCode.trim()) {
    return { isValid: false, error: 'Zip code is required' };
  }

  switch (country.toUpperCase()) {
    case 'USA':
      // US ZIP or ZIP+4
      if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
        return { isValid: false, error: 'US ZIP code must be 5 digits or ZIP+4 format' };
      }
      break;
    case 'IN':
      // Indian PIN code: 6 digits
      if (!/^\d{6}$/.test(zipCode)) {
        return { isValid: false, error: 'Indian PIN code must be 6 digits' };
      }
      break;
    case 'GB':
      // UK postcode: Complex pattern
      if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(zipCode)) {
        return { isValid: false, error: 'Invalid UK postcode format' };
      }
      break;
    case 'CA':
      // Canadian postal code: A1A 1A1
      if (!/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(zipCode)) {
        return { isValid: false, error: 'Invalid Canadian postal code format' };
      }
      break;
    default:
      // For other countries, ensure non-empty and reasonable length
      if (zipCode.length < 3 || zipCode.length > 10) {
        return { isValid: false, error: 'Postal code must be between 3 and 10 characters' };
      }
  }

  return { isValid: true };
}; 
