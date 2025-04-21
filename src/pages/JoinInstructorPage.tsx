import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InstructorForm from '@/components/instructors/InstructorForm';
import { InstructorFormValues } from '@/types/instructor';
import { handleInstructorFormSubmit } from '@/utils/joinInstructorFormHandler';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const JoinInstructorPage = () => {
  const handleSubmit = async (data: InstructorFormValues) => {
    try {
      console.log('Form submission initiated with data:', { 
        name: `${data.firstName} ${data.lastName}`,
        location: `${data.city}, ${data.state}, ${data.country}`,
        email: data.email
      });
      
      await handleInstructorFormSubmit(data);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">Share Your Expertise: Join Our Golf Instructor Network</h1>
              <p className="text-gray-600 mb-6">
                Complete the form below to apply as a golf instructor. Our admin team will review your application and get back to you within 48 hours.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mx-auto max-w-2xl">
                <AlertCircle size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 text-left">
                  <p className="font-medium">Application Process:</p>
                  <p>Your profile will be reviewed by our admin team before being published. We'll notify you via email once your application has been approved.</p>
                </div>
              </div>
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
