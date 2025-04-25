import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CategorySection.css';

// Updated category data to match the specialties
const categories = [
  {
    id: 'mental-approach',
    title: 'Mental Approach',
    image: '/images/mental-approach.jpg',
    path: '/instructors?specialties=Mental%20Approach'
  },
  {
    id: 'beginner-lessons',
    title: 'Beginner Lessons',
    image: '/images/beginner-lessons.jpg',
    path: '/instructors?specialties=Beginner%20Lessons'
  },
  {
    id: 'advanced-training',
    title: 'Advanced Training',
    image: '/images/advanced-training.jpg',
    path: '/instructors?specialties=Advanced%20Training'
  },
  {
    id: 'junior-coaching',
    title: 'Junior Coaching',
    image: '/images/junior-coaching.jpg',
    path: '/instructors?specialties=Junior%20Coaching'
  }
];

const CategorySection = () => {
  return (
    <section className="category-section">
      <h2 className="category-section-title">
        Explore Golf Specialties That Fit Your Needs
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
                    'mental-approach': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2070&auto=format&fit=crop',
                    'beginner-lessons': 'https://images.unsplash.com/photo-1535132011086-b8818f016104?q=80&w=2070&auto=format&fit=crop',
                    'advanced-training': 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?q=80&w=2070&auto=format&fit=crop',
                    'junior-coaching': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
