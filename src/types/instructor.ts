import { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export interface Highlight {
  label: string;
  icon: LucideIcon;
}

export interface Service {
  title: string;
  description: string;
  duration: string;
  price: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

export interface InstructorDetails {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tagline: string;
  experience: number;
  specialization: string;
  certifications: string[];
  bio: string;
  additionalBio: string;
  specialties: string[];
  highlights: Highlight[];
  services: Service[];
  faqs: FAQ[];
  photos: string[];
  contactInfo: ContactInfo;
}

export interface InstructorFormValues {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website?: string;
  
  // Professional Information
  experience: number;
  // Enhanced location fields
  postalCode: string;
  country: string;
  state: string;
  city: string;
  location: string; // We'll keep this for compatibility, will be generated from the other fields
  latitude?: number;
  longitude?: number;
  tagline?: string;
  specialization: string;
  bio: string;
  additionalBio?: string;
  
  // Certifications
  certifications: {
    pga: boolean;
    lpga: boolean;
    tpi: boolean;
    other: boolean;
    otherText?: string;
  };
  
  // Lesson Types/Services
  lessonTypes: {
    privateLesson: boolean;
    groupLessons: boolean;
    onlineCoaching: boolean;
    oncourseInstruction: boolean;
    advancedTraining: boolean;
    juniorCoaching: boolean;
  };
  
  // Services pricing and details
  services: {
    privateLesson?: {
      price: string;
      duration: string;
      description: string;
    };
    groupLessons?: {
      price: string;
      duration: string;
      description: string;
    };
    onlineCoaching?: {
      price: string;
      duration: string;
      description: string;
    };
    oncourseInstruction?: {
      price: string;
      duration: string;
      description: string;
    };
    advancedTraining?: {
      price: string;
      duration: string;
      description: string;
    };
    juniorCoaching?: {
      price: string;
      duration: string;
      description: string;
    };
  };
  
  // Specialties
  specialties: {
    shortGame: boolean;
    putting: boolean;
    driving: boolean;
    courseStrategy: boolean;
    mentalApproach: boolean;
    beginnerLessons: boolean;
    advancedTraining: boolean;
    juniorCoaching: boolean;
  };
  
  // Photos
  photos?: string[];
  profilePhoto: File | null;
  additionalPhotos: File[] | null;
  
  // FAQs
  faqs: Record<string, any>;
}

export interface Instructor {
  id: string;
  name: string;
  location: string;
  image: string;
  experience: number;
  specialty: string;
  lessonType: string;
  rate: string;
  rating?: number;
  reviews?: number;
  specialization: string;
  priceRange: string;
  imageUrl?: string;
  certifications?: string[];
  services?: Service[];
  latitude?: number;
  longitude?: number;
}

export interface ProcessedInstructor {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  website?: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  experience: number;
  tagline: string;
  specialization: string;
  bio: string;
  additional_bio?: string;
  specialties: string[];
  certifications: string[];
  lesson_types: string[];
  highlights: string[];
  photos: string[];
  services: Array<{
    title: string;
    description: string;
    duration: string;
    price: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  contact_info: {
    email: string;
    phone: string;
    website?: string;
  };
  is_approved: boolean;
  status: string;
  admin_notes?: string;
  rating: number;
  review_count: number;
  profile_views: number;
  created_at: string;
  updated_at: string;
  last_active: string;
}

// Base interfaces for instructor data
export interface InstructorBase {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  website?: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  experience: string | number;
  tagline?: string;
  specialization: string;
  bio: string;
  additional_bio?: string;
}

export interface InstructorDTO {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  location: string;
  latitude: string | null;
  longitude: string | null;
  experience: number;
  tagline: string;
  specialization: string;
  bio: string;
  additional_bio?: string;
  specialties: string[];
  certifications: string[];
  lesson_types: string[];
  highlights: string[];
  photos: string[];
  services: Array<{
    title: string;
    description: string;
    duration: string;
    price: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  contact_info: {
    email: string;
    phone: string;
    website?: string;
  };
  is_approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;

  last_active?: string;
  updated_at?: string;
}

// Zod schema for validation
export const ServiceSchema = z.object({
  price: z.union([
    z.string(),
    z.number()
  ]).transform(val => {
    if (typeof val === 'string') {
      return val.startsWith('$') ? val : `$${val}`;
    }
    return `$${val}`;
  }),
  title: z.string().min(1),
  duration: z.string().transform(val => {
    const num = parseInt(val.replace(/[^0-9]/g, ''));
    return isNaN(num) ? val : `${num} minutes`;
  }),
  description: z.string()
});

export const FAQSchema = z.object({
  question: z.string(),
  answer: z.string()
});

export const InstructorSchema = z.object({
  // Basic Info
  id: z.string().uuid().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url().optional().nullable(),

  // Location
  country: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  postal_code: z.string(),
  
  // Professional Info
  experience: z.union([z.number(), z.string()]),
  tagline: z.string().optional().nullable(),
  specialization: z.string(),
  bio: z.string().min(10),
  additional_bio: z.string().optional().nullable(),

  // Arrays
  specialties: z.array(z.string()),
  certifications: z.array(z.string()),
  lesson_types: z.array(z.string()),
  highlights: z.array(z.string()),
  photos: z.array(z.string()),

  // Complex Objects
  services: z.union([
    z.array(ServiceSchema),
    z.record(z.string(), ServiceSchema)
  ]),
  faqs: z.array(FAQSchema),
  contact_info: z.object({
    email: z.string().email(),
    phone: z.string(),
    website: z.string().optional()
  }),

  // Status
  is_approved: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected']),
  admin_notes: z.string().nullable().optional(),
  rating: z.number(),
  review_count: z.number(),
  profile_views: z.number()
});
