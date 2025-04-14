import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CategorySection.css';

// Category data
const categories = [
  {
    id: 'in-person',
    title: 'In Person Lessons',
    image: '/images/in-person-lessons.jpg',
    path: '/instructors?category=in-person'
  },
  {
    id: 'online',
    title: 'Online Lessons',
    image: '/images/online-lessons.jpg',
    path: '/instructors?category=online'
  },
  {
    id: 'academy',
    title: 'Golf Academy',
    image: '/images/golf-academy.jpg',
    path: '/instructors?category=academy'
  },
  {
    id: 'competitive',
    title: 'Competitive Golf Training',
    image: '/images/competitive-training.jpg',
    path: '/instructors?category=competitive'
  },
  {
    id: 'advanced',
    title: 'Advanced Training',
    image: '/images/advanced-training.jpg',
    path: '/instructors?category=advanced'
  },
  {
    id: 'womens',
    title: 'Women\'s Golf Lessons',
    image: '/images/womens-golf.jpg',
    path: '/instructors?category=womens'
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
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
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
