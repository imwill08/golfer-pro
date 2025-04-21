export interface Instructor {
  id: string
  created_at: string
  name: string
  location: string
  latitude: number | null
  longitude: number | null
  experience: number
  specialization: string
  specialties: string[]
  certifications: string[]
  tagline: string | null
  photos: string[]
  highlights: string[] | null
  services: {
    title: string
    description: string
    duration: string
    price: string
  }[]
  contact_info: {
    email: string
    phone: string
    website: string
  }
  is_approved: boolean
  status: 'pending' | 'approved' | 'rejected'
  bio: string
  additional_bio: string | null
  user_id: string | null
  updated_at: string
} 