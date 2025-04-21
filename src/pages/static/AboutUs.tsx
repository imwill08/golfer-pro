import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Trophy, Users, Target, Sparkles } from 'lucide-react';

const AboutUs = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-white pt-16 pb-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              About GolfPro Connect
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Transforming the way golfers learn and instructors teach through innovative technology and meaningful connections.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none dark:prose-invert">
          {/* Mission Section */}
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At GolfPro Connect, we're passionate about connecting golfers with expert instructors who can help them elevate their game. Our platform serves as a bridge between dedicated golf professionals and enthusiastic learners, making quality golf instruction accessible to everyone.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16 py-12 bg-gray-50 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-muted-foreground">Active Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <Users className="h-6 w-6 text-primary" />
                  For Golfers
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Easy access to qualified golf instructors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Detailed instructor profiles and reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Multiple lesson formats available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Flexible scheduling options
                  </li>
                </ul>
              </div>
              <div className="bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <Trophy className="h-6 w-6 text-primary" />
                  For Instructors
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Professional profile management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Increased visibility to potential students
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Easy booking management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Platform for showcasing expertise
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Excellence</h3>
                <p className="text-muted-foreground">We maintain high standards for our instructors and service quality.</p>
              </div>
              <div className="text-center p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Accessibility</h3>
                <p className="text-muted-foreground">Making quality golf instruction available to everyone.</p>
              </div>
              <div className="text-center p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovation</h3>
                <p className="text-muted-foreground">Continuously improving our platform and services.</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gray-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a golfer looking to improve your game or an instructor wanting to share your expertise, GolfPro Connect is here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link to="/instructors">Find an Instructor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/join-instructor">Become an Instructor</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs; 