import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Trophy, Globe, Mail, Phone, Instagram } from 'lucide-react';

interface InstructorProfile {
  id: string;
  name: string;
  location: string;
  tagline: string;
  experience: number;
  specialization: string;
  bio: string;
  additional_bio?: string;
  certifications: string[];
  specialties: string[];
  services: {
    title: string;
    description: string;
    duration: number;
    price: number;
  }[];
  highlights: {
    label: string;
    icon: string;
  }[];
  contact_info: {
    email: string;
    phone: string;
    website?: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

const InstructorProfilePage = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Transform the data to match our InstructorProfile interface
          const transformedData: InstructorProfile = {
            id: data.id,
            name: data.name,
            location: data.location,
            tagline: data.tagline,
            experience: data.experience,
            specialization: data.specialization,
            bio: data.bio,
            additional_bio: data.additional_bio,
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
            services: Array.isArray(data.services) ? data.services.map((service: any) => ({
              title: service.title || '',
              description: service.description || '',
              duration: Number(service.duration) || 0,
              price: Number(service.price) || 0
            })) : [],
            highlights: Array.isArray(data.highlights) ? data.highlights.map((highlight: any) => ({
              label: highlight.label || '',
              icon: highlight.icon || ''
            })) : [],
            contact_info: {
              email: typeof data.contact_info === 'object' && data.contact_info !== null 
                ? (data.contact_info as any).email || ''
                : '',
              phone: typeof data.contact_info === 'object' && data.contact_info !== null 
                ? (data.contact_info as any).phone || ''
                : '',
              website: typeof data.contact_info === 'object' && data.contact_info !== null 
                ? (data.contact_info as any).website
                : undefined
            },
            faqs: Array.isArray(data.faqs) ? data.faqs.map((faq: any) => ({
              question: faq.question || '',
              answer: faq.answer || ''
            })) : []
          };

          setInstructor(transformedData);
        }
      } catch (err) {
        console.error('Error fetching instructor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <h3 className="text-xl mb-3">Certified Golf Instructor and Fitter</h3>
              <div className="space-y-4 text-gray-600">
                <p>{instructor?.bio}</p>
                {instructor?.additional_bio && <p>{instructor.additional_bio}</p>}
              </div>
            </div>

            {/* Specialties Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Specialities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Short Game</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Course Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Mental Approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Driving Distance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">Advance Training</span>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span>Hired 4 Times</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>3 Years In Business</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Offers Online Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span>2 Employees</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Photos</h2>
            {/* Photos grid implementation */}
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <div className="grid gap-6">
              {instructor?.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <div className="text-xl font-bold text-blue-600">${service.price}</div>
                  </div>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="text-gray-500">Duration: {service.duration} minutes</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'faqs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
            <div className="space-y-4">
              {instructor?.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-center">Instructor not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <div className="bg-white rounded-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="w-64 h-64 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                  <p className="text-gray-600 text-lg mb-4">{instructor.tagline}</p>
                </div>
              </div>
            </div>

            {/* Tabs and Content */}
            <div className="bg-white rounded-xl">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-8 px-6">
                  <button
                    className={`py-4 px-2 -mb-px font-medium ${
                      activeTab === 'about'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('about')}
                  >
                    About
                  </button>
                  <button
                    className={`py-4 px-2 -mb-px font-medium ${
                      activeTab === 'photos'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('photos')}
                  >
                    Photos
                  </button>
                  <button
                    className={`py-4 px-2 -mb-px font-medium ${
                      activeTab === 'services'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('services')}
                  >
                    Services
                  </button>
                  <button
                    className={`py-4 px-2 -mb-px font-medium ${
                      activeTab === 'faqs'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('faqs')}
                  >
                    FAQs
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Location: {instructor.location}</span>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">{instructor.experience}+ Years Experience</span>
                </div>

                {/* Specialization */}
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-700">Swing Analysis Specialist</span>
                </div>

                {/* PGA Certified */}
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">PGA Certified</span>
                </div>

                {/* Divider */}
                <div className="border-t my-4"></div>

                {/* Price */}
                <div>
                  <div className="text-gray-600 mb-1">Price:</div>
                  <div className="text-2xl font-bold">${instructor.services[0]?.price || 0} / Hr</div>
                </div>

                {/* Divider */}
                <div className="border-t my-4"></div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`mailto:${instructor.contact_info.email}`} className="text-gray-600 hover:text-blue-600">
                        {instructor.contact_info.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`tel:${instructor.contact_info.phone}`} className="text-gray-600 hover:text-blue-600">
                        {instructor.contact_info.phone}
                      </a>
                    </div>
                    {instructor.contact_info.website && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-gray-500" />
                        <a href={`https://${instructor.contact_info.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {instructor.contact_info.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Instagram className="w-5 h-5 mr-3 text-gray-500" />
                      <a href="https://instagram.com/john_doe34" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        john_doe34
                      </a>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <a href="https://youtube.com/@BirdieHacks" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        @BirdieHacks
                      </a>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <a href="https://facebook.com/SwingSavy_34" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        SwingSavy_34
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Book a Lesson
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorProfilePage;
