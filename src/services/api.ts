import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface Golfer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  // Add other golfer properties as needed
}

export interface FilterParams {
  specialties?: string[];
  experienceRange?: [number, number];
  priceRange?: [number, number];
  certifications?: string[];
  searchTerm?: string;
  location?: string;
}

export interface Instructor {
  // ... existing code ...
}

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchGolfers = async (): Promise<Golfer[]> => {
  try {
    // TODO: Replace with your actual API endpoint
    const response = await apiClient.get('/api/golfers');
    return response.data;
  } catch (error) {
    console.error('Error fetching golfers:', error);
    return [];
  }
};

export const fetchFilteredInstructors = async (filters: FilterParams) => {
  try {
    // In a real application with a backend, we would send these filters as query params
    // For now, we'll handle filtering on the client side via the useInstructors hook
    console.log('Filters being applied:', filters);
    const response = await apiClient.get('/api/instructors', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered instructors:', error);
    // Since we're mocking the API call, we'll return an empty array
    return [];
  }
};

export const fetchInstructors = async () => {
  try {
    const response = await apiClient.get('/api/instructors');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};
