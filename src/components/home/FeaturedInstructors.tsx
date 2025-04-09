
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Updated mock data for featured instructors with more details
const featuredInstructors = [
  {
    id: '1',
    name: 'John Smith',
    location: 'Portland, OR',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    experience: '15 Years Coaching',
    specialty: 'Short Game Expert',
    lessonTypes: ['In-Person', 'Academy'],
    priceRange: '75-150$ /Hr'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    location: 'Miami, FL',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    experience: '10 Years Coaching',
    specialty: 'Mental Game Coach',
    lessonTypes: ['Online'],
    priceRange: '60-120$ /Hr'
  },
  {
    id: '3',
    name: 'David Brown',
    location: 'San Diego, CA',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    experience: '20 Years Coaching',
    specialty: 'Advanced Swing Mechanics',
    lessonTypes: ['In-Person'],
    priceRange: '50-100$ /Hr'
  },
  {
    id: '4',
    name: 'Alex Ryder',
    location: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    experience: '8 Years Coaching',
    specialty: 'Swing Analysis Specialist',
    lessonTypes: ['In-Person', 'Online'],
    priceRange: '50-100$ /Hr'
  }
];

const FeaturedInstructors = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-golf-blue">
          Meet Our Top Golf Instructors
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredInstructors.map((instructor) => (
            <Card key={instructor.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={instructor.imageUrl} 
                  alt={instructor.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="text-xl font-semibold">{instructor.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin size={14} />
                    <span>{instructor.location}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={16} className="text-golf-blue" />
                  <span>{instructor.experience}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} className="text-golf-blue" />
                  <span>{instructor.specialty}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructor.lessonTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-lg font-semibold text-golf-blue mt-2">
                  <DollarSign size={18} />
                  <span>{instructor.priceRange}</span>
                </div>
                
                <Link to={`/instructors/${instructor.id}`} className="block mt-4">
                  <Button 
                    className="w-full bg-golf-blue hover:bg-golf-blue/90 transition-all duration-300"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/instructors">
            <Button size="lg" className="bg-golf-blue hover:bg-golf-blue/90">
              View All Instructors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInstructors;
