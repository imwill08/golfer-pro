
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import InstructorForm from '@/components/instructors/InstructorForm';
import { InstructorFormValues } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AddInstructor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: InstructorFormValues) => {
    try {
      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // Prepare contact info
      const contactInfo = {
        email: data.email,
        phone: data.phone,
        website: data.website || '',
      };
      
      // Prepare certifications array
      const certifications = [];
      if (data.certifications.pga) certifications.push('PGA');
      if (data.certifications.lpga) certifications.push('LPGA');
      if (data.certifications.tpi) certifications.push('TPI');
      if (data.certifications.other && data.certifications.otherText) {
        certifications.push(data.certifications.otherText);
      }
      
      // Prepare specialties array
      const specialties = [];
      if (data.specialties.shortGame) specialties.push('Short Game');
      if (data.specialties.putting) specialties.push('Putting');
      if (data.specialties.driving) specialties.push('Driving');
      if (data.specialties.courseStrategy) specialties.push('Course Strategy');
      if (data.specialties.mentalApproach) specialties.push('Mental Approach');
      if (data.specialties.beginnerLessons) specialties.push('Beginner Lessons');
      if (data.specialties.advancedTraining) specialties.push('Advanced Training');
      if (data.specialties.juniorCoaching) specialties.push('Junior Coaching');
      
      // Prepare services array
      const services = [];
      if (data.lessonTypes.privateLesson && data.services.privateLesson) {
        services.push({
          title: 'Private Lesson',
          description: data.services.privateLesson.description,
          duration: data.services.privateLesson.duration,
          price: data.services.privateLesson.price
        });
      }
      if (data.lessonTypes.groupLessons && data.services.groupLessons) {
        services.push({
          title: 'Group Lessons',
          description: data.services.groupLessons.description,
          duration: data.services.groupLessons.duration,
          price: data.services.groupLessons.price
        });
      }
      if (data.lessonTypes.onlineCoaching && data.services.onlineCoaching) {
        services.push({
          title: 'Online Coaching',
          description: data.services.onlineCoaching.description,
          duration: data.services.onlineCoaching.duration,
          price: data.services.onlineCoaching.price
        });
      }
      if (data.lessonTypes.oncourseInstruction && data.services.oncourseInstruction) {
        services.push({
          title: 'On-Course Instruction',
          description: data.services.oncourseInstruction.description,
          duration: data.services.oncourseInstruction.duration,
          price: data.services.oncourseInstruction.price
        });
      }
      
      // Prepare FAQs array
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
      
      // Create default highlights
      const highlights = [
        {
          label: "Professional Experience",
          icon: "Trophy"
        },
        {
          label: "Personalized Instruction",
          icon: "Target"
        },
        {
          label: "Flexible Scheduling",
          icon: "Calendar"
        }
      ];
      
      // Add instructor to database
      const { data: newInstructor, error } = await supabase
        .from('instructors')
        .insert({
          name: fullName,
          location: data.location,
          tagline: data.tagline || `Professional Golf Instructor with ${data.experience} years of experience`,
          experience: data.experience,
          specialization: data.specialization,
          certifications,
          bio: data.bio,
          additional_bio: data.additionalBio || '',
          specialties,
          highlights,
          services,
          faqs,
          contact_info: contactInfo,
          photos: [], // Start with empty photos array
          approved: true, // Auto-approve instructors added by admin
          user_id: user?.id // Set the user_id to the current authenticated user's ID
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Instructor Added',
        description: 'The instructor has been successfully added.',
      });
      
      // Navigate to the manage instructors page
      navigate('/admin/instructors');
      
    } catch (err) {
      console.error('Error adding instructor:', err);
      toast({
        title: 'Error',
        description: 'Failed to add instructor. ' + (err.message || ''),
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
          <h1 className="text-2xl font-bold mb-6">Add Instructor</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <InstructorForm 
              onSubmit={handleSubmit} 
              isAdmin={true}
              buttonText="Add Instructor"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddInstructor;
