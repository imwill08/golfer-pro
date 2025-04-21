import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Trophy, Award, Star, Mail, Phone, Globe, Instagram, Youtube, Facebook, Eye, MousePointerClick } from 'lucide-react';
import ProfileSidebar from '@/components/instructors/ProfileSidebar';
import { cn } from '@/lib/utils';

interface InstructorProfile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  location: string;
  tagline: string;
  experience: number;
  specialization: string;
  bio: string;
  photos: string[];
  services: {
    title: string;
    description: string;
    duration: string;
    price: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  contact_info: {
    email: string;
    phone: string;
    website: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  certifications: string[];
  rating: number;
  review_count: number;
  stats?: {
    profile_views: number;
    contact_clicks: number;
  };
}

const InstructorProfilePage = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const viewTracked = useRef(false);

  // Refs for scroll sections
  const aboutRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!id) {
        setError('No instructor ID provided');
        setLoading(false);
        return;
      }

      try {
        // First fetch the stats directly
        const { data: statsData } = await supabase
          .from('instructor_stats')
          .select('profile_views, contact_clicks')
          .eq('instructor_id', id)
          .single();

        // Then fetch instructor data
        const { data: instructorData, error: instructorError } = await supabase
          .from('instructors')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (instructorError) throw instructorError;
        
        if (!instructorData) {
          setError('Instructor not found');
          setLoading(false);
          return;
        }
        
        // Combine instructor data with stats
        const transformedData = {
          ...instructorData,
          stats: statsData || { profile_views: 0, contact_clicks: 0 }
        };

        console.log('Initial stats loaded:', transformedData.stats);
        setInstructor(transformedData);
      } catch (err) {
        console.error('Error fetching instructor:', err);
        setError('Failed to load instructor profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructor();
  }, [id]);

  // Track profile view
  useEffect(() => {
    const trackProfileView = async () => {
      if (id && !viewTracked.current) {
        try {
          console.log('Tracking profile view for instructor:', id);
          
          // First check if a stats record exists
          const { data: existingStats, error: checkError } = await supabase
            .from('instructor_stats')
            .select('*')
            .eq('instructor_id', id)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking stats:', checkError);
            return;
          }

          const newViewCount = (existingStats?.profile_views || 0) + 1;
          console.log('Updating profile views to:', newViewCount);

          if (existingStats) {
            // Update existing record
            const { error: updateError } = await supabase
              .from('instructor_stats')
              .update({ 
                profile_views: newViewCount,
                updated_at: new Date().toISOString()
              })
              .eq('instructor_id', id);

            if (updateError) {
              console.error('Error updating stats:', updateError);
              return;
            }
          } else {
            // Create new record
            const { error: insertError } = await supabase
              .from('instructor_stats')
              .insert({
                instructor_id: id,
                profile_views: 1,
                contact_clicks: 0
              });

            if (insertError) {
              console.error('Error inserting stats:', insertError);
              return;
            }
          }

          viewTracked.current = true;

          // Update the local state immediately
          setInstructor(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              stats: {
                ...prev.stats,
                profile_views: newViewCount
              }
            };
          });

        } catch (err) {
          console.error('Error tracking profile view:', err);
        }
      }
    };

    trackProfileView();
  }, [id]);

  // Track contact clicks
  const trackContactClick = async (clickType: string) => {
    if (!id) return;
    
    try {
      console.log('Tracking contact click:', { instructor_id: id, click_type: clickType });

      // First log the click
      const { error: logError } = await supabase
        .from('contact_click_logs')
        .insert({
          instructor_id: id,
          click_type: clickType
        });

      if (logError) {
        console.error('Error logging click:', logError);
        return;
      }

      // Check if stats record exists and get current stats
      const { data: existingStats, error: checkError } = await supabase
        .from('instructor_stats')
        .select('*')
        .eq('instructor_id', id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking stats:', checkError);
        return;
      }

      const newClickCount = (existingStats?.contact_clicks || 0) + 1;
      console.log('Updating contact clicks to:', newClickCount);

      if (existingStats) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('instructor_stats')
          .update({ 
            contact_clicks: newClickCount,
            updated_at: new Date().toISOString()
          })
          .eq('instructor_id', id);

        if (updateError) {
          console.error('Error updating stats:', updateError);
          return;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('instructor_stats')
          .insert({
            instructor_id: id,
            profile_views: 0,
            contact_clicks: 1
          });

        if (insertError) {
          console.error('Error inserting stats:', insertError);
          return;
        }
      }

      // Update the local state immediately
      setInstructor(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            contact_clicks: newClickCount
          }
        };
      });

    } catch (err) {
      console.error('Error tracking contact click:', err);
    }
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>, tabName: string) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(tabName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-blue"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {error || 'Instructor not found'}
            </h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golf-blue"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : instructor ? (
          <>
            {/* Profile Header */}
            <div className="bg-white border-b">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
                {/* Profile Image - Mobile Optimized */}
                <div className="flex flex-col items-center md:items-start md:flex-row gap-4 md:gap-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 flex-shrink-0">
                    <img
                      src={instructor.photos[0] || '/default-profile.png'}
                      alt={instructor.name}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {instructor.name}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {instructor.tagline}
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{instructor.location}</span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-golf-blue" />
                        <span className="text-xs sm:text-sm">{instructor.experience}+ Years Experience</span>
                      </div>
                      {instructor.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-golf-blue" />
                          <span className="text-xs sm:text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-16 bg-white border-b z-30">
              <div className="container mx-auto px-0 sm:px-6 lg:px-8 max-w-7xl">
                <nav className="grid grid-cols-4 w-full">
                  <button
                    onClick={() => scrollToSection(aboutRef, 'about')}
                    className={cn(
                      "py-2.5 px-2 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm md:text-base",
                      activeTab === 'about'
                        ? "border-golf-blue text-golf-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection(photosRef, 'photos')}
                    className={cn(
                      "py-2.5 px-2 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm md:text-base",
                      activeTab === 'photos'
                        ? "border-golf-blue text-golf-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Photos
                  </button>
                  <button
                    onClick={() => scrollToSection(servicesRef, 'services')}
                    className={cn(
                      "py-2.5 px-2 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm md:text-base",
                      activeTab === 'services'
                        ? "border-golf-blue text-golf-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection(faqsRef, 'faqs')}
                    className={cn(
                      "py-2.5 px-2 sm:py-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm md:text-base",
                      activeTab === 'faqs'
                        ? "border-golf-blue text-golf-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    FAQs
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content and Sidebar Layout */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* About Section */}
                  <div ref={aboutRef} className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">About</h2>
                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{instructor.bio}</p>
                  </div>

                  {/* Photos Section */}
                  <div ref={photosRef} className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6">Photos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {instructor.photos.map((photo, index) => (
                        <div key={index} className="w-full aspect-square overflow-hidden rounded-lg">
                          <img
                            src={photo}
                            alt={`${instructor.name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services Section */}
                  <div ref={servicesRef} className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Services & Pricing</h2>
                    <div className="space-y-6">
                      {instructor.services.map((service, index) => (
                        <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{service.title}</h3>
                            <span className="text-lg font-medium text-golf-blue">
                              ${service.price}/hr
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{service.description}</p>
                          <p className="text-sm text-gray-500">Duration: {service.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs Section */}
                  {instructor.faqs && instructor.faqs.length > 0 && (
                    <div ref={faqsRef}>
                      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                      <div className="space-y-6">
                        {instructor.faqs.map((faq, index) => (
                          <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
                    {/* Profile Stats */}
                    <div className="flex justify-between mb-6 pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-golf-blue" />
                        <div>
                          <div className="text-sm text-gray-500">Profile Views</div>
                          <div className="font-semibold text-xl">{instructor?.stats?.profile_views || 0}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-5 h-5 text-golf-blue" />
                        <div>
                          <div className="text-sm text-gray-500">Contact Clicks</div>
                          <div className="font-semibold text-xl">{instructor?.stats?.contact_clicks || 0}</div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-golf-blue" />
                        <span className="font-medium">Location: {instructor.location}</span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-golf-blue" />
                        <span className="font-medium">{instructor.experience}+ Years Experience</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    {instructor.certifications.map((cert, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-golf-blue" />
                          <span className="font-medium">{cert}</span>
                        </div>
                      </div>
                    ))}

                    {/* Price */}
                    <div className="border-t border-b py-4 my-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium">Price:</span>
                        <span className="text-golf-blue font-bold text-xl">100$ / Hr</span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Contact Details</h3>
                      
                      {instructor.contact_info.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-golf-blue" />
                          <a 
                            href={`mailto:${instructor.contact_info.email}`}
                            className="text-gray-700 hover:text-golf-blue"
                            onClick={() => trackContactClick('email')}
                          >
                            {instructor.contact_info.email}
                          </a>
                        </div>
                      )}
                      
                      {instructor.contact_info.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-golf-blue" />
                          <a 
                            href={`tel:${instructor.contact_info.phone}`}
                            className="text-gray-700 hover:text-golf-blue"
                            onClick={() => trackContactClick('phone')}
                          >
                            {instructor.contact_info.phone}
                          </a>
                        </div>
                      )}
                      
                      {instructor.contact_info.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-golf-blue" />
                          <a 
                            href={instructor.contact_info.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-golf-blue"
                            onClick={() => trackContactClick('website')}
                          >
                            {instructor.contact_info.website}
                          </a>
                        </div>
                      )}

                      {/* Social Media Links */}
                      {(instructor.contact_info.instagram || 
                        instructor.contact_info.youtube || 
                        instructor.contact_info.facebook) && (
                        <div className="pt-4 mt-4 border-t">
                          {instructor.contact_info.instagram && (
                            <div className="flex items-center gap-3 mb-3">
                              <Instagram className="w-5 h-5 text-golf-blue" />
                              <a 
                                href={`https://instagram.com/${instructor.contact_info.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-golf-blue"
                                onClick={() => trackContactClick('instagram')}
                              >
                                {instructor.contact_info.instagram}
                              </a>
                            </div>
                          )}
                          {instructor.contact_info.youtube && (
                            <div className="flex items-center gap-3 mb-3">
                              <Youtube className="w-5 h-5 text-golf-blue" />
                              <a 
                                href={`https://youtube.com/${instructor.contact_info.youtube}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-golf-blue"
                                onClick={() => trackContactClick('youtube')}
                              >
                                {instructor.contact_info.youtube}
                              </a>
                            </div>
                          )}
                          {instructor.contact_info.facebook && (
                            <div className="flex items-center gap-3">
                              <Facebook className="w-5 h-5 text-golf-blue" />
                              <a 
                                href={`https://facebook.com/${instructor.contact_info.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-golf-blue"
                                onClick={() => trackContactClick('facebook')}
                              >
                                {instructor.contact_info.facebook}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorProfilePage;
