
import React from 'react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InstructorForm from '@/components/instructors/InstructorForm';
import { InstructorFormValues } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';

const JoinInstructorPage = () => {
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
      
      // Add instructor to database (pending approval)
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
          approved: false // Set to false by default for public submissions
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully. We will review it and get back to you soon.',
      });
      
    } catch (err) {
      console.error('Error submitting application:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">Share Your Expertise: Join Our Golf Instructor Network</h1>
              <p className="text-gray-600">
                Complete the form below to apply as a golf instructor. Our team will review your application and get back to you within 48 hours.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <InstructorForm 
                onSubmit={handleSubmit} 
                buttonText="Submit Application"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default JoinInstructorPage;
