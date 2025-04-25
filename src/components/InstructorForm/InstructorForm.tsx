import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Loader2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, TextAreaField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { InstructorDTO } from '@/types/instructor';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

// Local interfaces for form handling
interface FormService {
  title: string;
  description: string;
  duration: string;
  price: string;
}

interface FormCertification {
  name: string;
  issuer: string;
  year: string;
}

interface FormFAQ {
  equipment_answer: string;
  lessons_needed_answer: string;
  packages_answer: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  experience: number;
  tagline: string;
  specialization: string;
  bio: string;
  additional_bio?: string;
  lesson_types: string[];
  services: FormService[];
  specialties: string[];
  certifications: FormCertification[];
  highlights: string[];
  faqs: FormFAQ;
  photos: string[];
  profile_photo: File | null;
  gallery_photos: File[];
  contact_info: {
    email: string;
    phone: string;
    website?: string;
  };
}

interface InstructorFormProps {
  onSubmit: (data: InstructorDTO) => Promise<void>;
  onPhotoUpload: (file: File) => Promise<string>;
  initialData?: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    website: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
    experience: number;
    tagline: string;
    specialization: string;
    bio: string;
    additional_bio: string;
    lesson_types: string[];
    services: FormService[];
    specialties: string[];
    certifications: FormCertification[];
    highlights: string[];
    faqs: Array<{ question: string; answer: string; }>;
    photos: string[];
    profile_photo: File;
    gallery_photos: File[];
    contact_info: {
      email: string;
      phone: string;
      website: string;
    };
  }>;
  isLoading?: boolean;
}

const serviceSchema = z.object({
  title: z.string().min(2, "Service name is required"),
  description: z.string().min(10, "Service description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required")
});

const certificationSchema = z.object({
  name: z.string().min(2, "Certification name is required"),
  issuer: z.string().min(2, "Issuer name is required"),
  year: z.string().min(4, "Valid year is required")
});

const instructorFormSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .transform(val => val.trim())
    .refine(val => val.length > 0, 'First name is required'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .transform(val => val.trim())
    .refine(val => val.length > 0, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  website: z.string().url('Invalid website URL').optional(),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postal_code: z.string().min(5, 'Postal code must be at least 5 characters'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  specialization: z.string().min(5, 'Specialization must be at least 5 characters'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  additional_bio: z.string().optional(),
  lesson_types: z.array(z.string()),
  services: z.array(z.object({
    name: z.string(),
    description: z.string(),
    price: z.string(),
    duration: z.string()
  })),
  specialties: z.array(z.string()),
  certifications: z.array(z.object({
    name: z.string().min(1, "Certification name is required"),
    issuer: z.string().min(1, "Issuer name is required"),
    year: z.string().min(4, "Valid year is required")
  })),
  highlights: z.array(z.string()).optional(),
  faqs: z.object({
    equipment_answer: z.string().optional(),
    lessons_needed_answer: z.string().optional(),
    packages_answer: z.string().optional()
  }).default({
    equipment_answer: '',
    lessons_needed_answer: '',
    packages_answer: ''
  }),
  photos: z.array(z.string()).optional(),
  contact_info: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    website: z.string().url('Invalid website URL').optional()
  })
});

// Update the getCoordinates function to handle state abbreviations
async function getCoordinates(address: { city: string; state: string; country: string; postal_code: string }) {
  try {
    // Ensure proper formatting
    const formattedAddress = {
      city: address.city.trim(),
      state: address.state.trim(),
      country: address.country.trim(),
      postal_code: address.postal_code.trim()
    };

    console.log('Attempting geocoding with formatted address:', formattedAddress);

    // First try with postal code
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${formattedAddress.postal_code}&country=${formattedAddress.country}&state=${formattedAddress.state}&city=${formattedAddress.city}&limit=1`;
    console.log('Making geocoding request:', nominatimUrl);
    
    let response = await fetch(nominatimUrl);
    let data = await response.json();

    // If no results, try with full address
    if (!data.length) {
      const fullAddressUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${formattedAddress.city}, ${formattedAddress.state}, ${formattedAddress.country}, ${formattedAddress.postal_code}`
      )}&limit=1`;
      console.log('Making fallback geocoding request:', fullAddressUrl);
      
      response = await fetch(fullAddressUrl);
      data = await response.json();
    }

    if (data.length > 0) {
      console.log('Geocoding result:', data[0]);
      return {
        latitude: data[0].lat,
        longitude: data[0].lon
      };
    }
    
    console.warn('No geocoding results found');
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function InstructorForm({
  onSubmit,
  onPhotoUpload,
  initialData,
  isLoading
}: InstructorFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonTypes, setLessonTypes] = useState<Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }>>(
    initialData?.lesson_types?.map(type => {
      if (typeof type === 'string') {
        return {
          title: type,
          description: `${type} golf lessons`,
          duration: '60',
          price: 0
        };
      }
      return type;
    }) || []
  );

  // Add state for coordinates
  const [coordinates, setCoordinates] = useState<{ latitude: string; longitude: string } | null>(null);

  // Add these state handlers for photos
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(initialData?.photos?.[0] || null);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(
    Array.isArray(initialData?.gallery_photos) 
      ? initialData.gallery_photos.map(photo => typeof photo === 'string' ? photo : '')
      : []
  );

  // Log initial form data
  useEffect(() => {
    console.log('Form initialized with data:', initialData);
  }, [initialData]);

  const defaultFaqs = {
    equipment_answer: '',
    lessons_needed_answer: '',
    packages_answer: ''
  };

  // Initialize FAQs from existing data if available
  const initializeFaqs = (existingFaqs: Array<{question: string, answer: string}> | undefined): FormFAQ => {
    if (!existingFaqs || !Array.isArray(existingFaqs)) {
      return defaultFaqs;
    }

    return {
      equipment_answer: existingFaqs.find(f => f.question.includes('equipment'))?.answer || '',
      lessons_needed_answer: existingFaqs.find(f => f.question.includes('lessons'))?.answer || '',
      packages_answer: existingFaqs.find(f => f.question.includes('packages'))?.answer || ''
    };
  };

  const form = useForm<FormData>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      country: initialData?.country || '',
      state: initialData?.state || '',
      city: initialData?.city || '',
      postal_code: initialData?.postal_code || '',
      experience: initialData?.experience || 0,
      tagline: initialData?.tagline || '',
      specialization: initialData?.specialization || '',
      bio: initialData?.bio || '',
      additional_bio: initialData?.additional_bio || '',
      lesson_types: initialData?.lesson_types || [],
      services: initialData?.services || [],
      specialties: initialData?.specialties || [],
      certifications: initialData?.certifications || [],
      highlights: initialData?.highlights || [],
      faqs: initializeFaqs(initialData?.faqs),
      photos: initialData?.photos || [],
      profile_photo: initialData?.profile_photo || null,
      gallery_photos: initialData?.gallery_photos || [],
      contact_info: {
        email: initialData?.contact_info?.email || '',
        phone: initialData?.contact_info?.phone || '',
        website: initialData?.contact_info?.website || ''
      }
    }
  });

  // Watch form values
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(`Field "${name}" changed:`, {
        value,
        type,
        allFormData: form.getValues()
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Watch for address changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Check if any address field changed
      if (['city', 'state', 'country', 'postal_code'].includes(name || '')) {
        const addressData = form.getValues();
        if (addressData.city && addressData.state && addressData.country && addressData.postal_code) {
          console.log('Address changed, updating coordinates...');
          getCoordinates({
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            postal_code: addressData.postal_code
          }).then(coords => {
            if (coords) {
              console.log('New coordinates:', coords);
              setCoordinates(coords);
            }
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const { fields: services, append: appendService, remove: removeService } = useFieldArray({
    name: "services",
    control: form.control
  });

  const { fields: certifications, append: appendCertification, remove: removeCertification } = useFieldArray({
    name: "certifications",
    control: form.control
  });

  // Watch for FAQ changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name?.startsWith('faqs.')) {
        console.log('FAQ field changed:', {
          field: name,
          value,
          type
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const steps = [
    { title: 'Personal Info', fields: ['first_name', 'last_name', 'email', 'phone', 'website'] },
    { title: 'Professional', fields: ['experience', 'tagline', 'specialization', 'bio'] },
    { title: 'Services', fields: ['lesson_types', 'services'] },
    { title: 'Specialties & FAQs', fields: ['specialties', 'certifications', 'faqs'] },
    { title: 'Photos', fields: ['photos'] }
  ];

  const handleNext = async () => {
    console.log('Attempting to move to next step. Current step:', activeStep);
    const isValid = await form.trigger(steps[activeStep].fields as any);
    console.log('Step validation result:', {
      step: activeStep,
      fields: steps[activeStep].fields,
      isValid,
      errors: form.formState.errors
    });
    if (isValid) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
      console.log('Moving to next step. New step:', Math.min(activeStep + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const addLessonType = () => {
    setLessonTypes([...lessonTypes, {
      title: '',
      description: '',
      duration: '',
      price: 0
    }]);
  };

  const removeLessonType = (index: number) => {
    const updatedTypes = lessonTypes.filter((_, i) => i !== index);
    setLessonTypes(updatedTypes);
    form.setValue('lesson_types', updatedTypes as any);
  };

  const updateLessonType = (index: number, field: string, value: string | number) => {
    const updatedTypes = [...lessonTypes];
    updatedTypes[index] = {
      ...updatedTypes[index],
      [field]: value
    };
    setLessonTypes(updatedTypes);
    form.setValue('lesson_types', updatedTypes as any);
  };

  const handleServiceAdd = () => {
    console.log('Adding new service');
    const newService: FormService = {
      title: '',
      description: '',
      duration: '',
      price: ''
    };
    appendService(newService);
    console.log('Current services after add:', form.getValues('services'));
  };

  const handleCertificationAdd = () => {
    console.log('Adding new certification');
    const newCertification: FormCertification = {
      name: '',
      issuer: '',
      year: ''
    };
    const currentCertifications = form.getValues('certifications') || [];
    form.setValue('certifications', [...currentCertifications, newCertification]);
    console.log('Current certifications after add:', form.getValues('certifications'));
  };

  const handleCertificationRemove = (index: number) => {
    console.log(`Removing certification at index ${index}`);
    const currentCertifications = form.getValues('certifications') || [];
    const updatedCertifications = currentCertifications.filter((_, i) => i !== index);
    form.setValue('certifications', updatedCertifications);
    console.log('Current certifications after remove:', form.getValues('certifications'));
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Profile photo selected:', file);
    
    if (file && file.type.startsWith('image/')) {
      try {
        console.log('Uploading profile photo...');
        const url = await onPhotoUpload(file);
        console.log('Profile photo uploaded successfully:', url);
        setProfilePhotoUrl(url);
        form.setValue('photos', [url]);
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        toast.error('Failed to upload profile photo');
      }
    }
  };

  const handleGalleryPhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    console.log('Gallery photos selected:', imageFiles);

    try {
      console.log('Uploading gallery photos...');
      const urls = await Promise.all(
        imageFiles.map(file => onPhotoUpload(file))
      );
      console.log('Gallery photos uploaded successfully:', urls);
      const updatedGalleryPhotos = [...galleryPhotos, ...urls];
      setGalleryPhotos(updatedGalleryPhotos);
      form.setValue('gallery_photos', updatedGalleryPhotos as any);
      // No need to store actual files since we're storing URLs
    } catch (error) {
      console.error('Error uploading gallery photos:', error);
      toast.error('Failed to upload one or more gallery photos');
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhotoUrl(null);
    form.setValue('photos', []);
  };

  const removeGalleryPhoto = (index: number) => {
    const updatedGalleryPhotos = galleryPhotos.filter((_, i) => i !== index);
    setGalleryPhotos(updatedGalleryPhotos);
    form.setValue('gallery_photos', updatedGalleryPhotos as any);
  };

  const [selectedSpecialties, setSelectedSpecialties] = useState<Record<string, boolean>>({
    'Short Game': false,
    'Putting': false,
    'Driving': false,
    'Course Strategy': false,
    'Mental Approach': false,
    'Beginner Lessons': false,
    'Advanced Training': false,
    'Junior Coaching': false,
    ...Object.fromEntries((initialData?.specialties || []).map(type => [type, true]))
  });

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    console.log('Specialty changed:', { specialty, checked });
    setSelectedSpecialties(prev => {
      const newState = { ...prev, [specialty]: checked };
      const selectedSpecialties = Object.entries(newState)
        .filter(([_, isSelected]) => isSelected)
        .map(([specialty]) => specialty);
      form.setValue('specialties', selectedSpecialties);
      return newState;
    });
  };

  const onSubmitForm = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate required profile photo
      if (!profilePhotoUrl) {
        toast.error("Profile photo is required");
        return;
      }

      const instructorDTO: InstructorDTO = {
        id: undefined, // Will be generated by the database
        created_at: undefined, // Will be set by the database
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        name: [data.first_name.trim(), data.last_name.trim()]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '',
        website: data.website?.trim() || '',
        country: data.country.trim(),
        state: data.state.trim(),
        city: data.city.trim(),
        postal_code: data.postal_code.trim(),
        location: `${data.city.trim()}, ${data.state.trim()}, ${data.country.trim()}`,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
        experience: data.experience,
        tagline: data.tagline?.trim() || `Professional Golf Instructor with ${data.experience} years of experience`,
        specialization: data.specialization.trim(),
        bio: data.bio.trim(),
        additional_bio: data.additional_bio?.trim() || '',
        specialties: data.specialties || [],
        certifications: data.certifications.map(cert => 
          `${cert.name.trim()} - ${cert.issuer.trim()} (${cert.year.trim()})`
        ),
        lesson_types: lessonTypes,
        highlights: data.highlights || [],
        photos: profilePhotoUrl ? [profilePhotoUrl] : [],
        gallery_photos: galleryPhotos,
        services: data.services.map(service => ({
          title: service.title.trim(),
          description: service.description.trim(),
          duration: service.duration.trim(),
          price: service.price.trim()
        })),
        faqs: (() => {
          try {
            console.log('Raw FAQ data:', data.faqs);
            
            if (!data.faqs) {
              console.warn('FAQs object is undefined');
              return [];
            }

            // Transform form FAQ data to DTO format
            const faqArray = [
              {
                question: "Do students need to bring their own equipment?",
                answer: data.faqs.equipment_answer
              },
              {
                question: "How many lessons will students typically need?",
                answer: data.faqs.lessons_needed_answer
              },
              {
                question: "Do you offer lesson packages or discounts?",
                answer: data.faqs.packages_answer
              }
            ].filter(faq => faq.answer && faq.answer.trim().length > 0)
             .map(faq => ({
               question: faq.question,
               answer: faq.answer.trim()
             }));
            
            console.log('Transformed FAQ array:', faqArray);
            return faqArray;
          } catch (error) {
            console.error('Error processing FAQs:', error);
            return [];
          }
        })(),
        contact_info: {
          email: data.contact_info.email.trim(),
          phone: data.contact_info.phone.trim(),
          website: data.contact_info.website?.trim() || ''
        },
        is_approved: false,
        status: 'pending',
        admin_notes: null,

        last_active: undefined, // Will be set by the database
        updated_at: undefined // Will be set by the database
      };
      
      console.log('Final DTO with processed FAQs:', {
        faqCount: instructorDTO.faqs.length,
        faqs: instructorDTO.faqs
      });

      await onSubmit(instructorDTO);
      
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Failed to submit form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
      {/* Step Navigation */}
      <div className="flex space-x-4 mb-8">
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => setActiveStep(index)}
            className={`px-4 py-2 rounded ${
              activeStep === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {activeStep === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                {...form.register('first_name')}
                placeholder="John"
                error={form.formState.errors.first_name?.message as string}
              />
              <FormField
                label="Last Name"
                required
                {...form.register('last_name')}
                placeholder="Doe"
                error={form.formState.errors.last_name?.message as string}
              />
            </div>
            <FormField
              label="Email"
              required
              type="email"
              {...form.register('email')}
              placeholder="john.doe@example.com"
              error={form.formState.errors.email?.message as string}
            />
            <FormField
              label="Phone Number"
              required
              {...form.register('phone')}
              placeholder="+1 (555) 123-4567"
              error={form.formState.errors.phone?.message as string}
            />
            <FormField
              label="Website"
              {...form.register('website')}
              placeholder="www.example.com"
              error={form.formState.errors.website?.message as string}
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <FormField
              label="Years of Experience"
              required
              type="number"
              {...form.register('experience')}
              error={form.formState.errors.experience?.message as string}
            />
            <FormField
              label="Tagline"
              {...form.register('tagline')}
              placeholder="Your professional tagline"
              error={form.formState.errors.tagline?.message as string}
            />
            <FormField
              label="Specialization"
              required
              {...form.register('specialization')}
              placeholder="Your main area of expertise"
              error={form.formState.errors.specialization?.message as string}
            />
            <TextAreaField
              label="Professional Bio"
              required
              {...form.register('bio')}
              placeholder="Tell us about your golf teaching experience..."
              error={form.formState.errors.bio?.message as string}
            />
          </>
        )}

        {activeStep === 2 && (
          <>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lesson Types</h3>
                <p className="text-sm text-gray-600">Add between 1 and 3 types of lessons you offer. Currently added: {lessonTypes.length}/3</p>
                
                {lessonTypes.map((lessonType, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={lessonType.title}
                            onChange={(e) => updateLessonType(index, 'title', e.target.value)}
                            placeholder="e.g., Private Lesson"
                          />
                        </div>
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={lessonType.duration}
                            onChange={(e) => updateLessonType(index, 'duration', e.target.value)}
                            placeholder="e.g., 60"
                          />
                        </div>
                        <div>
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            value={lessonType.price}
                            onChange={(e) => updateLessonType(index, 'price', Number(e.target.value))}
                            placeholder="e.g., 100"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLessonType(index)}
                        className="ml-4"
                      >
                        Remove
                      </Button>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={lessonType.description}
                        onChange={(e) => updateLessonType(index, 'description', e.target.value)}
                        placeholder="Describe what's included in this lesson type..."
                      />
                    </div>
                  </div>
                ))}
                
                {lessonTypes.length < 3 && (
                  <Button
                    type="button"
                    onClick={addLessonType}
                    className="w-full"
                    variant="outline"
                  >
                    Add Another Lesson
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              {services.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Service Name</Label>
                    <Input
                      {...form.register(`services.${index}.title`)}
                      className={form.formState.errors.services?.[index]?.title ? "border-red-500" : ""}
                    />
                    {form.formState.errors.services?.[index]?.title?.message && (
                      <p className="text-sm text-red-500">{form.formState.errors.services[index]?.title?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      {...form.register(`services.${index}.description`)}
                      className={form.formState.errors.services?.[index]?.description ? "border-red-500" : ""}
                    />
                    {form.formState.errors.services?.[index]?.description?.message && (
                      <p className="text-sm text-red-500">{form.formState.errors.services[index]?.description?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      {...form.register(`services.${index}.duration`, { valueAsNumber: true })}
                      className={form.formState.errors.services?.[index]?.duration ? "border-red-500" : ""}
                    />
                    {form.formState.errors.services?.[index]?.duration?.message && (
                      <p className="text-sm text-red-500">{form.formState.errors.services[index]?.duration?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      {...form.register(`services.${index}.price`, { valueAsNumber: true })}
                      className={form.formState.errors.services?.[index]?.price ? "border-red-500" : ""}
                    />
                    {form.formState.errors.services?.[index]?.price?.message && (
                      <p className="text-sm text-red-500">{form.formState.errors.services[index]?.price?.message}</p>
                    )}
                  </div>
                  <Button onClick={() => removeService(index)} type="button" variant="destructive">
                    Remove Service
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleServiceAdd}
              >
                Add Service
              </Button>
            </div>
          </>
        )}

        {activeStep === 3 && (
          <>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                <p className="text-sm text-gray-600 mb-4">Select all areas where you have specialized expertise.</p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedSpecialties).map(([specialty, isSelected]) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                      />
                      <label htmlFor={`specialty-${specialty}`} className="text-sm">
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600 mb-4">Help potential clients understand what to expect when working with you.</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Do students need to bring their own equipment?</Label>
                    <textarea
                      {...form.register('faqs.equipment_answer')}
                      placeholder="e.g., Yes, please bring your own clubs. However, I can provide equipment for beginners if needed."
                      className="w-full min-h-[100px] p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>How many lessons will students typically need?</Label>
                    <textarea
                      {...form.register('faqs.lessons_needed_answer')}
                      placeholder="e.g., It varies based on your goals and current skill level. Most students see significant improvement after 3-5 lessons."
                      className="w-full min-h-[100px] p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Do you offer lesson packages or discounts?</Label>
                    <textarea
                      {...form.register('faqs.packages_answer')}
                      placeholder="e.g., Yes, I offer package discounts for multiple lessons. A 5-lesson package includes a 10% discount from the individual lesson price."
                      className="w-full min-h-[100px] p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Photo Upload */}
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">Profile Photo <span className="text-red-500">*</span></h3>
                  <p className="text-sm text-gray-600 mb-4">Upload a professional photo of yourself</p>
                  <label 
                    htmlFor="profile-photo-upload" 
                    className="w-full max-w-[300px] aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800"
                  >
                    {profilePhotoUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={profilePhotoUrl}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeProfilePhoto();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-400 mb-4" />
                        <span className="text-sm text-gray-500">Click to upload profile photo</span>
                        <span className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</span>
                      </>
                    )}
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {form.formState.errors.photos && (
                    <p className="text-sm text-red-500 mt-2">Profile photo is required</p>
                  )}
                </div>
              </div>

              {/* Gallery Photos Upload */}
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">Gallery Photos</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload photos of you teaching or in action</p>
                  <label 
                    htmlFor="gallery-photos-upload" 
                    className="w-full max-w-[300px] aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-4" />
                    <span className="text-sm text-gray-500">Click to upload gallery photos</span>
                    <span className="text-xs text-gray-400 mt-1">Up to 5 photos, 5MB each</span>
                    <input
                      id="gallery-photos-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryPhotosChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery Preview Grid */}
                {galleryPhotos.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Gallery Preview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryPhotos.map((photoUrl, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={photoUrl}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            onClick={() => removeGalleryPhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={activeStep === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
} 