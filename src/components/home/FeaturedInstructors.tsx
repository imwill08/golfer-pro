import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/keyboard';
import './FeaturedInstructors.css';

// Updated mock data for featured instructors
const featuredInstructors = [
  {
    id: '1',
    name: 'John Smith',
    location: 'Los Angeles, USA',
    imageUrl: '/images/instructor-1.jpg',
  },
  {
    id: '2',
    name: 'Bradley Monroe',
    location: 'Scottsdale, Arizona',
    imageUrl: '/images/instructor-2.jpg',
  },
  {
    id: '3',
    name: 'Taylor Kensington',
    location: 'Palm Beach, Florida',
    imageUrl: '/images/instructor-3.jpg',
  },
  {
    id: '4',
    name: 'Michael Brooks',
    location: 'Austin, Texas',
    imageUrl: '/images/instructor-4.jpg',
  },
  {
    id: '5',
    name: 'Sarah Palmer',
    location: 'San Diego, California',
    imageUrl: '/images/instructor-5.jpg',
  }
];

const FeaturedInstructors = () => {
  return (
    <section className="featured-section">
      <div className="container mx-auto px-6">
        <h2 className="featured-title">
          Meet Our Top Golf Instructors
        </h2>
        
        <Swiper
          modules={[Keyboard, Mousewheel]}
          spaceBetween={24}
          slidesPerView={3}
          keyboard={{
            enabled: true,
          }}
          mousewheel={{
            enabled: true,
            sensitivity: 1,
            thresholdDelta: 50,
            forceToAxis: true,
          }}
          watchOverflow={true}
          grabCursor={true}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            }
          }}
          className="instructor-swiper"
        >
          {featuredInstructors.map((instructor) => (
            <SwiperSlide key={instructor.id}>
              <Link 
                to={`/instructors/${instructor.id}`} 
                className="instructor-card"
                onClick={(e) => e.preventDefault()} // Prevent navigation while swiping
                onMouseUp={(e) => {
                  // Allow navigation on mouse up
                  e.currentTarget.click();
                }}
              >
                <div className="instructor-image-container">
                  <img 
                    src={instructor.imageUrl} 
                    alt={instructor.name}
                    className="instructor-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
                    }}
                    draggable="false"
                  />
                </div>
                <div className="instructor-info">
                  <h3 className="instructor-name">{instructor.name}</h3>
                  <p className="instructor-location">{instructor.location}</p>
                  <ArrowRight className="instructor-arrow" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedInstructors;
