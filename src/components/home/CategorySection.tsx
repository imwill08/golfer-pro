import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CategorySection.css';

// Updated category data with more relevant images and proper filter query params
const categories = [
  {
    id: 'private',
    title: 'Private Lessons',
    image: '/images/private-lesson.jpg',
    path: '/instructors?lessonType=private'
  },
  {
    id: 'online',
    title: 'Online Coaching',
    image: '/images/online-coaching.jpg',
    path: '/instructors?lessonType=online'
  },
  {
    id: 'group',
    title: 'Group Lessons',
    image: '/images/group-lesson.jpg',
    path: '/instructors?lessonType=group'
  },
  {
    id: 'oncourse',
    title: 'On-Course Instruction',
    image: '/images/on-course-lesson.jpg',
    path: '/instructors?lessonType=oncourse'
  }
];

const CategorySection = () => {
  return (
    <section className="category-section">
      <h2 className="category-section-title">
        Explore Golf Lessons That Fit Your Needs
      </h2>
      
      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={category.path}
            className="category-card"
          >
            <div className="category-image-container">
              <img 
                src={category.image} 
                alt={category.title} 
                className="category-image"
                onError={(e) => {
                  const fallbackImages = {
                    'private': 'https://images.unsplash.com/photo-1535132011086-b8818f016104?q=80&w=2070&auto=format&fit=crop',
                    'online': 'https://images.unsplash.com/photo-1591285713698-598d587de63e?q=80&w=2070&auto=format&fit=crop',
                    'group': 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?q=80&w=2070&auto=format&fit=crop',
                    'oncourse': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop'
                  };
                  e.currentTarget.src = fallbackImages[category.id] || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="category-title-container">
              <h3 className="category-title">{category.title}</h3>
              <ArrowRight className="category-arrow" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
