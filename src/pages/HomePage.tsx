import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedInstructors from '@/components/home/FeaturedInstructors';
import CTASection from '@/components/home/CTASection';

const HomePage = () => {
  return (
    <>
      <Navbar />
      
      <main>
        <div className="container mx-auto px-4 py-8">
        </div>
        <HeroBanner />
        <CategorySection />
        <FeaturedInstructors />
        <CTASection />
      </main>
      
      <Footer />
    </>
  );
};

export default HomePage;
