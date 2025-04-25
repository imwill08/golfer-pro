import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  MapPin, Trophy, Award, Star, Mail, Phone, Globe, Instagram, Youtube, 
  Facebook, Eye, MousePointerClick, Calendar, Briefcase, Flag, Building2,
  Clock, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface InstructorProfile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  website: string;
  country: string;
  state: string;
  city: string;
  location: string;
  experience: number;
  tagline: string;
  specialization: string;
  bio: string;
  additional_bio: string;
  specialties: string[];
  certifications: string[];
  photos: string[];
  lesson_types: Array<{
    title: string;
    description: string;
    duration: string;
    price: number;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  contact_info: {
    email: string;
    phone: string;
    website: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  review_count: number;
  profile_views: number;
  updated_at: string;
  stats?: {
    profile_views: number;
    contact_clicks: number;
  };
  gallery_photos: string[];
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
  const specialtiesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  // Add intersection observer for section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveTab(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px'
      }
    );

    const sections = [aboutRef, servicesRef, specialtiesRef, faqsRef, galleryRef];
    sections.forEach((section) => {
      if (section.current) {
        observer.observe(section.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.current) {
          observer.unobserve(section.current);
        }
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-blue dark:border-golf-blue-light"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Instructor not found'}
            </h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-16 pb-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golf-blue dark:border-golf-blue-light"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : instructor ? (
          <>
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Left Column - Photos */}
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={instructor.photos[0] || '/default-profile.png'}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Additional Photos Grid */}
                    {instructor.photos.length > 1 && (
                      <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4">
                        {instructor.photos.slice(1, 4).map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
                            <img
                              src={photo}
                              alt={`${instructor.name} photo ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{instructor.name}</h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Professional Golf Instructor with {instructor.experience}+ years of experience</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Eye className="w-4 h-4" />
                          <span>{instructor.stats?.profile_views || 0} views</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: {format(new Date(instructor.updated_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>

                    {/* Location & Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <MapPin className="w-5 h-5 text-golf-blue dark:text-golf-blue-light" />
                        <span className="text-sm sm:text-base">{`${instructor.city}, ${instructor.state}, ${instructor.country}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Trophy className="w-5 h-5 text-golf-blue dark:text-golf-blue-light" />
                        <span className="text-sm sm:text-base">{instructor.experience}+ Years Experience</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="mt-4 sm:mt-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Certifications</h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {instructor.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 sm:gap-2 bg-primary/5 dark:bg-primary/10 px-2.5 sm:px-3 py-1.5 rounded-full"
                          >
                            <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Profile Views</div>
                        <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{instructor.stats?.profile_views || 0}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Contact Clicks</div>
                        <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{instructor.stats?.contact_clicks || 0}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Experience</div>
                        <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{instructor.experience}+ yrs</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Lesson Types</div>
                        <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{instructor.lesson_types.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-16 bg-white dark:bg-gray-800 border-b z-30 mt-8 w-full">
              <div className="w-full max-w-[100vw] overflow-x-auto scrollbar-none">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <nav className="flex whitespace-nowrap gap-4 sm:gap-8 pb-px min-w-fit">
                    <button
                      onClick={() => scrollToSection(aboutRef, 'about')}
                      className={cn(
                        "py-4 font-medium text-sm transition-colors relative flex-shrink-0",
                        activeTab === 'about'
                          ? "text-golf-blue border-b-2 border-golf-blue dark:text-golf-blue-light dark:border-golf-blue-light"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      )}
                    >
                      About
                    </button>
                    <button
                      onClick={() => scrollToSection(servicesRef, 'services')}
                      className={cn(
                        "py-4 font-medium text-sm transition-colors relative flex-shrink-0",
                        activeTab === 'services'
                          ? "text-golf-blue border-b-2 border-golf-blue dark:text-golf-blue-light dark:border-golf-blue-light"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      )}
                    >
                      Lesson Types
                    </button>
                    <button
                      onClick={() => scrollToSection(specialtiesRef, 'specialties')}
                      className={cn(
                        "py-4 font-medium text-sm transition-colors relative flex-shrink-0",
                        activeTab === 'specialties'
                          ? "text-golf-blue border-b-2 border-golf-blue dark:text-golf-blue-light dark:border-golf-blue-light"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      )}
                    >
                      Specialties
                    </button>
                    <button
                      onClick={() => scrollToSection(faqsRef, 'faqs')}
                      className={cn(
                        "py-4 font-medium text-sm transition-colors relative flex-shrink-0",
                        activeTab === 'faqs'
                          ? "text-golf-blue border-b-2 border-golf-blue dark:text-golf-blue-light dark:border-golf-blue-light"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      )}
                    >
                      FAQs
                    </button>
                    <button
                      onClick={() => scrollToSection(galleryRef, 'gallery')}
                      className={cn(
                        "py-4 font-medium text-sm transition-colors relative flex-shrink-0",
                        activeTab === 'gallery'
                          ? "text-golf-blue border-b-2 border-golf-blue dark:text-golf-blue-light dark:border-golf-blue-light"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      )}
                    >
                      Gallery
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  {/* About Section */}
                  <section id="about" ref={aboutRef} className="bg-white rounded-xl p-6 shadow-sm scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <div className="mt-6 space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">About {instructor.first_name}</h3>
                      <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300">{instructor.bio}</p>
                        {instructor.additional_bio && (
                          <p className="text-gray-600 dark:text-gray-300 mt-4">{instructor.additional_bio}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Lesson Types Section */}
                  <section id="services" ref={servicesRef} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm scroll-mt-24">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Lesson Types</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {instructor.lesson_types.map((lesson, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{lesson.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                            <span className="font-medium text-golf-blue dark:text-golf-blue-light">${lesson.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Specialties Section */}
                  <section id="specialties" ref={specialtiesRef} className="bg-white rounded-xl p-6 shadow-sm scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Specialties</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {instructor.specialties.map((specialty, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
                        >
                          <Star className="w-5 h-5 text-golf-blue" />
                          <span>{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Gallery Section */}
                  <section id="gallery" ref={galleryRef} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm scroll-mt-24">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Gallery</h2>
                    {instructor.gallery_photos && instructor.gallery_photos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {instructor.gallery_photos.map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <img
                              src={photo}
                              alt={`${instructor.name} - gallery photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No gallery photos available
                      </p>
                    )}
                  </section>

                  {/* FAQs Section */}
                  <section id="faqs" ref={faqsRef} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm scroll-mt-24">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {instructor.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                      {instructor.faqs.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No FAQs available
                        </p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column - Contact & Additional Info */}
                <div className="space-y-6">
                  {/* Contact Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
                    <div className="space-y-4">
                      {/* Contact Methods */}
                      <div className="grid grid-cols-1 gap-3">
                        {instructor.contact_info.email && (
                          <a 
                            href={`mailto:${instructor.contact_info.email}`}
                            onClick={() => trackContactClick('email')}
                            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Mail className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{instructor.contact_info.email}</span>
                          </a>
                        )}
                        {instructor.contact_info.phone && (
                          <a 
                            href={`tel:${instructor.contact_info.phone}`}
                            onClick={() => trackContactClick('phone')}
                            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Phone className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{instructor.contact_info.phone}</span>
                          </a>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex flex-wrap gap-2">
                        {instructor.contact_info.website && (
                          <a 
                            href={instructor.contact_info.website.startsWith('http') ? instructor.contact_info.website : `https://${instructor.contact_info.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContactClick('website')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Globe className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Website</span>
                          </a>
                        )}
                        {instructor.contact_info.instagram && (
                          <a 
                            href={instructor.contact_info.instagram.startsWith('http') ? instructor.contact_info.instagram : `https://instagram.com/${instructor.contact_info.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContactClick('instagram')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Instagram className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Instagram</span>
                          </a>
                        )}
                        {instructor.contact_info.youtube && (
                          <a 
                            href={instructor.contact_info.youtube.startsWith('http') ? instructor.contact_info.youtube : `https://youtube.com/${instructor.contact_info.youtube}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContactClick('youtube')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Youtube className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">YouTube</span>
                          </a>
                        )}
                        {instructor.contact_info.facebook && (
                          <a 
                            href={instructor.contact_info.facebook.startsWith('http') ? instructor.contact_info.facebook : `https://facebook.com/${instructor.contact_info.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContactClick('facebook')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-golf-blue dark:hover:border-golf-blue-light transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-golf-blue dark:text-golf-blue-light" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Facebook</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Location</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-golf-blue" />
                        <span>{instructor.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-golf-blue" />
                        <span>{instructor.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-golf-blue" />
                        <span>{instructor.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Specialization */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Professional Info</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500">Experience</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="w-5 h-5 text-golf-blue" />
                          <span className="font-medium">{instructor.experience}+ Years</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Specialization</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Trophy className="w-5 h-5 text-golf-blue" />
                          <span className="font-medium">{instructor.specialization}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-5 h-5 text-golf-blue" />
                          <span className="font-medium">
                            {format(new Date(instructor.updated_at), 'MMMM yyyy')}
                          </span>
                        </div>
                      </div>
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
