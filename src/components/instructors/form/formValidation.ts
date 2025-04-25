import { z } from 'zod';

// Form validation schema
export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  experience: z.number().min(0, "Experience must be a positive number"),
  
  // Location fields with validation
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  location: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  tagline: z.string().optional(),
  specialization: z.string().min(1, "Specialization is required"),
  bio: z.string().min(1, "Professional bio is required"),
  additionalBio: z.string().optional(),
  certifications: z.object({
    pga: z.boolean(),
    lpga: z.boolean(),
    tpi: z.boolean(),
    other: z.boolean(),
    otherText: z.string().optional()
  }),
  lesson_types: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      duration: z.string().min(1, "Duration is required"),
      price: z.number().min(0, "Price must be a positive number")
    })
  ).min(1, "At least one lesson type is required"),
  specialties: z.object({
    shortGame: z.boolean(),
    putting: z.boolean(),
    driving: z.boolean(),
    courseStrategy: z.boolean(),
    mentalApproach: z.boolean(),
    beginnerLessons: z.boolean(),
    advancedTraining: z.boolean(),
    juniorCoaching: z.boolean()
  }),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ).default([]),
  photos: z.array(z.string()).optional(),
  gallery_photos: z.array(z.string()).optional(),
  profilePhoto: z.any().nullable(),
  additionalPhotos: z.any().nullable()
});
