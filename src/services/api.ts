import axios from 'axios';

interface Golfer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  // Add other golfer properties as needed
}

export const fetchGolfers = async (): Promise<Golfer[]> => {
  try {
    // TODO: Replace with your actual API endpoint
    const response = await axios.get('/api/golfers');
    return response.data;
  } catch (error) {
    console.error('Error fetching golfers:', error);
    return [];
  }
}; 