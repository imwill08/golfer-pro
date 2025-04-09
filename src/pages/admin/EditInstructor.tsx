import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import InstructorForm from '@/components/instructors/InstructorForm';
import { InstructorFormValues } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const EditInstructor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: instructor, isLoading } = useQuery({
    queryKey: ['instructor', id],
    queryFn: async () => {
      if (!id) throw new Error('Instructor ID is required');
      
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const transformToFormValues = (instructorData: any): InstructorFormValues => {
    if (!instructorData) return {} as InstructorFormValues;
    
    const nameParts = instructorData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const contactInfo = instructorData.contact_info || {};
    
    const services: any = {};
    if (instructorData.services) {
      Object.entries(instructorData.services).forEach(([key, value]: [string, any]) => {
        services[key] = value;
      });
    }
    
    const certifications = {
      pga: instructorData.certifications?.includes('PGA') || false,
      lpga: instructorData.certifications?.includes('LPGA') || false,
      tpi: instructorData.certifications?.includes('TPI') || false,
      other: false,
      otherText: '',
    };
    
    instructorData.certifications?.forEach((cert: string) => {
      if (!['PGA', 'LPGA', 'TPI'].includes(cert)) {
        certifications.other = true;
        certifications.otherText = cert;
      }
    });
    
    const specialties = {
      shortGame: instructorData.specialties?.includes('Short Game') || false,
      putting: instructorData.specialties?.includes('Putting') || false,
      driving: instructorData.specialties?.includes('Driving') || false,
      courseStrategy: instructorData.specialties?.includes('Course Strategy') || false,
      mentalApproach: instructorData.specialties?.includes('Mental Approach') || false,
      beginnerLessons: instructorData.specialties?.includes('Beginner Lessons') || false,
      advancedTraining: instructorData.specialties?.includes('Advanced Training') || false,
      juniorCoaching: instructorData.specialties?.includes('Junior Coaching') || false,
    };
    
    const lessonTypes = {
      privateLesson: !!services.privateLesson,
      groupLessons: !!services.groupLessons,
      onlineCoaching: !!services.onlineCoaching,
      oncourseInstruction: !!services.oncourseInstruction,
    };
    
    const faqs: any = { customFaqs: [] };
    if (instructorData.faqs) {
      instructorData.faqs.forEach((faq: any) => {
        if (faq.question.includes('equipment')) {
          faqs.equipment = faq.answer;
        } else if (faq.question.includes('lessons')) {
          faqs.numberOfLessons = faq.answer;
        } else if (faq.question.includes('packages')) {
          faqs.packages = faq.answer;
        } else {
          faqs.customFaqs = [...(faqs.customFaqs || []), faq];
        }
      });
    }
    
    return {
      firstName,
      lastName,
      email: contactInfo.email || '',
      phone: contactInfo.phone || '',
      website: contactInfo.website || '',
      experience: instructorData.experience || 0,
      location: instructorData.location || '',
      tagline: instructorData.tagline || '',
      specialization: instructorData.specialization || '',
      bio: instructorData.bio || '',
      additionalBio: instructorData.additional_bio || '',
      certifications,
      lessonTypes,
      services,
      specialties,
      faqs,
      profilePhoto: null,
      additionalPhotos: null,
    };
  };

  const handleSubmit = async (data: InstructorFormValues) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      const contactInfo = {
        email: data.email,
        phone: data.phone,
        website: data.website || '',
      };
      
      const certifications = [];
      if (data.certifications.pga) certifications.push('PGA');
      if (data.certifications.lpga) certifications.push('LPGA');
      if (data.certifications.tpi) certifications.push('TPI');
      if (data.certifications.other && data.certifications.otherText) {
        certifications.push(data.certifications.otherText);
      }
      
      const specialties = [];
      if (data.specialties.shortGame) specialties.push('Short Game');
      if (data.specialties.putting) specialties.push('Putting');
      if (data.specialties.driving) specialties.push('Driving');
      if (data.specialties.courseStrategy) specialties.push('Course Strategy');
      if (data.specialties.mentalApproach) specialties.push('Mental Approach');
      if (data.specialties.beginnerLessons) specialties.push('Beginner Lessons');
      if (data.specialties.advancedTraining) specialties.push('Advanced Training');
      if (data.specialties.juniorCoaching) specialties.push('Junior Coaching');
      
      const services: any = {};
      if (data.lessonTypes.privateLesson && data.services.privateLesson) {
        services.privateLesson = data.services.privateLesson;
      }
      if (data.lessonTypes.groupLessons && data.services.groupLessons) {
        services.groupLessons = data.services.groupLessons;
      }
      if (data.lessonTypes.onlineCoaching && data.services.onlineCoaching) {
        services.onlineCoaching = data.services.onlineCoaching;
      }
      if (data.lessonTypes.oncourseInstruction && data.services.oncourseInstruction) {
        services.oncourseInstruction = data.services.oncourseInstruction;
      }
      
      const faqs = [];
      if (data.faqs.equipment) {
        faqs.push({
          question: 'Do I need to bring my own equipment?',
          answer: data.faqs.equipment,
        });
      }
      if (data.faqs.numberOfLessons) {
        faqs.push({
          question: 'How many lessons will I need?',
          answer: data.faqs.numberOfLessons,
        });
      }
      if (data.faqs.packages) {
        faqs.push({
          question: 'Do you offer packages?',
          answer: data.faqs.packages,
        });
      }
      if (data.faqs.customFaqs && data.faqs.customFaqs.length > 0) {
        faqs.push(...data.faqs.customFaqs);
      }
      
      let photos = instructor?.photos || [];
      
      const { error } = await supabase
        .from('instructors')
        .update({
          name: fullName,
          location: data.location,
          tagline: data.tagline || '',
          experience: data.experience,
          specialization: data.specialization,
          certifications,
          bio: data.bio,
          additional_bio: data.additionalBio || '',
          specialties,
          services,
          faqs,
          contact_info: contactInfo,
          photos,
          highlights: instructor?.highlights || [],
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Instructor Updated',
        description: 'The instructor profile has been updated successfully.',
      });
      
      navigate('/admin/instructors');
    } catch (err) {
      console.error('Error updating instructor:', err);
      toast({
        title: 'Error',
        description: 'Failed to update instructor profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Instructor</h1>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-golf-blue border-r-transparent"></div>
              <p className="mt-2">Loading instructor data...</p>
            </div>
          ) : instructor ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <InstructorForm 
                onSubmit={handleSubmit} 
                isAdmin={true}
                buttonText="Update Instructor"
                initialValues={transformToFormValues(instructor)}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-red-500">
              Instructor not found
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditInstructor;
