import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { MapPin, Eye, MousePointer } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import 'swiper/css';
import 'swiper/css/free-mode';
import './FeaturedInstructors.css';

interface FeaturedInstructor {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  profileViews: number;
  contactClicks: number;
  totalEngagement: number;
}

const FeaturedInstructors = () => {
  const [instructors, setInstructors] = useState<FeaturedInstructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopInstructors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: statsData, error: statsError } = await supabase
          .from('instructor_stats')
          .select('instructor_id, profile_views, contact_clicks')
          .order('profile_views', { ascending: false })
          .limit(8);

        if (statsError) throw new Error('Failed to fetch instructor statistics');

        if (!statsData || statsData.length === 0) {
          setInstructors([]);
          return;
        }

        const { data: instructorData, error: instructorError } = await supabase
          .from('instructors')
          .select('id, name, location, photos')
          .eq('status', 'approved')
          .in('id', statsData.map(s => s.instructor_id));

        if (instructorError) throw new Error('Failed to fetch instructor details');

        if (instructorData) {
          const transformedData = instructorData.map(instructor => {
            const stats = statsData.find(s => s.instructor_id === instructor.id);
            return {
              id: instructor.id,
              name: instructor.name,
              location: instructor.location,
              imageUrl: Array.isArray(instructor.photos) && instructor.photos.length > 0 
                ? instructor.photos[0] 
                : '/images/instructor-default.jpg',
              profileViews: stats?.profile_views || 0,
              contactClicks: stats?.contact_clicks || 0,
              totalEngagement: (stats?.profile_views || 0) + (stats?.contact_clicks || 0)
            };
          });

          // Sort by total engagement (views + clicks) in descending order
          const sortedData = transformedData.sort((a, b) => b.totalEngagement - a.totalEngagement);
          setInstructors(sortedData);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load instructors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopInstructors();
  }, []);

  const handleInstructorClick = (instructorId: string) => {
    navigate(`/instructors/${instructorId}`);
  };

  if (!supabase) {
    return <div className="text-center py-12 text-red-600">Database connection not available</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <section className="featured-section">
      <div className="container mx-auto px-4">
        <h2 className="featured-title">
          Meet Our Top Golf Instructors
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-golf-blue border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading instructors...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No featured instructors available yet.
          </div>
        ) : (
          <div className="instructor-container">
            <Swiper
              modules={[FreeMode, Autoplay]}
              spaceBetween={16}
              slidesPerView="auto"
              freeMode={{
                enabled: true,
                sticky: true,
                momentumRatio: 0.25,
                momentumVelocityRatio: 0.5,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              className="instructor-swiper"
            >
              {instructors.map((instructor) => (
                <SwiperSlide key={instructor.id} className="instructor-slide">
                  <div 
                    className="instructor-card border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => handleInstructorClick(instructor.id)}
                  >
                    <div className="instructor-image-wrapper">
                      <img 
                        src={instructor.imageUrl} 
                        alt={instructor.name}
                        className="instructor-image"
                        onError={(e) => {
                          e.currentTarget.src = '/images/instructor-default.jpg';
                        }}
                      />
                    </div>
                    <div className="instructor-info">
                      <h3 className="instructor-name">{instructor.name}</h3>
                      <div className="instructor-location">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{instructor.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="mr-1">Views:</span>
                          <span>{instructor.profileViews}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">Clicks:</span>
                          <span>{instructor.contactClicks}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedInstructors;
