import { LucideIcon } from 'lucide-react';

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
  location: string;
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
  
  // FAQs
  faqs: {
    equipment?: string;
    numberOfLessons?: string;
    packages?: string;
    customFaqs?: Array<{question: string; answer: string}>;
  };
  
  // Photos
  profilePhoto?: File | null;
  additionalPhotos?: File[] | null;
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
}

export type ProcessedInstructor = Instructor;
