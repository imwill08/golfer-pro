import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'In-Person Lessons',
    href: '/instructors?type=in-person',
  },
  {
    title: 'Online Lessons',
    href: '/instructors?type=online',
  },
  {
    title: 'Golf Academy',
    href: '/instructors?type=academy',
  },
  {
    title: 'Golf Practice Facilities',
    href: '/facilities',
  },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
      {categories.map((category) => (
        <Link
          key={category.title}
          to={category.href}
          className="p-4 text-center rounded-lg border hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium">{category.title}</h3>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid; 