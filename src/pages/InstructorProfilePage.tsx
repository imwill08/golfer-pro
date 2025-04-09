
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Clock, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileHeader from '@/components/instructors/ProfileHeader';
import ProfileTabs from '@/components/instructors/ProfileTabs';
import ProfileSidebar from '@/components/instructors/ProfileSidebar';
import { InstructorDetails, Highlight, Service, FAQ, ContactInfo } from '@/types/instructor';
import { supabase } from '@/integrations/supabase/client';

// Mock instructor data for fallback
const mockInstructorDetails: InstructorDetails = {
  id: '1',
  name: 'John Doe',
  location: 'Austin, TX',
  tagline: 'Helping golfers master their swing with 10+ years of coaching experience',
  experience: 10,
  specialization: 'Swing Analysis Specialist',
  certifications: ['PGA Certified'],
  bio: "I'm John Doe, a certified PGA golf instructor with over a decade of experience helping players of all skill levels improve their game. My teaching style focuses on building a solid foundation, understanding swing mechanics, and developing a personalized plan to meet your goals.\n\nWhether you're preparing for your first tournament or just want to feel more confident on the course, I tailor every lesson to your needs. I've worked with juniors, college athletes, and senior players alike.",
  additionalBio: "I am also a U. S. Kids Golf Certified Coach and a Science & Motion Golf Certified Putting Instructor. Blast Motion Golf software/sensor is used to help your game on the greens. I currently teach out of Columbia Super Range in South Everett.",
  specialties: ['Short Game', 'Course Strategy', 'Mental Approach', 'Driving Distance', 'Advance Training'],
  highlights: [
    { label: 'Hired 4 Times', icon: User },
    { label: '3 Years In Business', icon: Clock },
    { label: 'Offers Online Services', icon: Globe },
    { label: '2 Employees', icon: User }
  ],
  services: [
    {
      title: 'Private Lessons',
      description: '1-on-1 lessons tailored to your specific needs. Includes video analysis and personalized drills.',
      duration: '60 minutes',
      price: '$100'
    },
    {
      title: 'Group Lessons',
      description: 'Learn with friends or family in a small group setting. Perfect for beginners.',
      duration: '90 minutes',
      price: '$70 per person'
    },
    {
      title: 'On-Course Instruction',
      description: 'Real-world application of skills on the course. Includes strategy and course management.',
      duration: '2 hours',
      price: '$180'
    }
  ],
  faqs: [
    {
      question: 'What equipment should I bring to my first lesson?',
      answer: "For your first lesson, just bring your current clubs. No need for anything special. If you're a beginner without clubs, I can provide rental clubs for our session."
    },
    {
      question: 'How many lessons do most students take?',
      answer: "Most students see significant improvement after 3-5 lessons. However, this varies based on your goals and starting skill level. We'll discuss a recommended plan after our first session."
    },
    {
      question: 'Do you offer packages or discounts for multiple lessons?',
      answer: 'Yes, I offer packages of 5 or 10 lessons with a 10-15% discount. This is a great option for committed players looking for consistent improvement.'
    }
  ],
  photos: [
    '/lovable-uploads/0f187b29-3c8d-4a77-8eb8-e47132b2c389.png',
    '/lovable-uploads/61efc1d9-4f28-4e4c-a329-62b4be83cfd7.png',
    '/lovable-uploads/0fb271d0-98b9-444f-af69-16e601fd4680.png'
  ],
  contactInfo: {
    email: 'John_D5123@gmail.com',
    phone: '+99 6334 8756 23',
    website: 'johndoegolf.com'
  }
};

const InstructorProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [instructor, setInstructor] = useState<InstructorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInstructor = async () => {
      if (!id) return;
      
      try {
        // Fetch instructor data from Supabase
        const { data: instructorData, error: instructorError } = await supabase
          .from('instructors')
          .select('*')
          .eq('id', id)
          .single();
          
        if (instructorError) throw instructorError;
        
        if (!instructorData) {
          setInstructor(mockInstructorDetails);
          setLoading(false);
          return;
        }
        
        // Create a complete instructor object that matches our app's structure
        // Type assertions to ensure the JSON data matches our expected types
        const highlights = Array.isArray(instructorData.highlights) 
          ? instructorData.highlights as unknown as Highlight[]
          : mockInstructorDetails.highlights;
        
        const services = Array.isArray(instructorData.services) 
          ? instructorData.services as unknown as Service[]
          : mockInstructorDetails.services;
        
        const faqs = Array.isArray(instructorData.faqs) 
          ? instructorData.faqs as unknown as FAQ[]
          : mockInstructorDetails.faqs;
        
        const contactInfo = typeof instructorData.contact_info === 'object' && instructorData.contact_info !== null
          ? instructorData.contact_info as unknown as ContactInfo
          : mockInstructorDetails.contactInfo;
        
        const completeInstructor: InstructorDetails = {
          ...instructorData,
          additionalBio: instructorData.additional_bio || '',
          // Use our validated data
          highlights,
          services,
          faqs,
          contactInfo
        };
        
        setInstructor(completeInstructor);
      } catch (error) {
        console.error('Error fetching instructor:', error);
        setInstructor(mockInstructorDetails);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ProfileHeader instructor={instructor || mockInstructorDetails} />
              <ProfileTabs 
                instructor={instructor || mockInstructorDetails} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar instructor={instructor || mockInstructorDetails} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default InstructorProfilePage;
