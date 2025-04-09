
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Video, 
  GraduationCap, 
  Trophy, 
  Settings, 
  Users 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Category descriptions and icon mapping
const categories = [
  {
    id: 'in-person',
    title: 'In-Person Lessons',
    image: '/lovable-uploads/00ed25e7-cd84-4ea3-bf1d-38f8f9ef6109.png',
    description: 'Learn directly from certified coaches at local ranges and facilities.',
    icon: <Monitor className="h-5 w-5" />,
    path: '/instructors?category=in-person'
  },
  {
    id: 'online',
    title: 'Online Lessons',
    image: '/lovable-uploads/ca102fb5-694c-419c-9829-cb4c6756bea2.png',
    description: 'Get expert tips, drills, and video analysis from the comfort of home.',
    icon: <Video className="h-5 w-5" />,
    path: '/instructors?category=online'
  },
  {
    id: 'academy',
    title: 'Golf Academy',
    image: '/lovable-uploads/7aebdde5-0acb-4b2e-b7bf-3330b9969198.png',
    description: 'Structured programs offered by premium golf schools.',
    icon: <GraduationCap className="h-5 w-5" />,
    path: '/instructors?category=academy'
  },
  {
    id: 'competitive',
    title: 'Competitive Golf Training',
    image: '/lovable-uploads/93fbcd26-cdc1-460f-a2d7-8e4fe0d60ba6.png',
    description: 'Designed for junior or pro-level players preparing for tournaments.',
    icon: <Trophy className="h-5 w-5" />,
    path: '/instructors?category=competitive'
  },
  {
    id: 'advanced',
    title: 'Advanced Training',
    image: '/lovable-uploads/5dee926e-b745-4c15-bbef-730e3de13087.png',
    description: 'Specialized modules for swing mechanics, analytics & precision.',
    icon: <Settings className="h-5 w-5" />,
    path: '/instructors?category=advanced'
  },
  {
    id: 'womens',
    title: 'Women\'s Golf Lessons',
    image: 'https://images.unsplash.com/photo-1548187420-af32d33cc60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    description: 'Tailored coaching for female golfers from beginner to competitive level.',
    icon: <Users className="h-5 w-5" />,
    path: '/instructors?category=womens'
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-golf-blue">
          Explore Golf Lessons That Fit Your Needs
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <TooltipProvider key={category.id} delayDuration={700}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={category.path}
                    className="block group bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-103"
                  >
                    <div className="relative">
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={category.image} 
                          alt={category.title} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      
                      {/* Icon badge */}
                      <div className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md">
                        {category.icon}
                      </div>
                      
                      {/* Hover overlay - visible on larger screens */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 lg:block hidden">
                        <p className="text-white font-bold text-sm bg-black/40 p-2 rounded">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-center mb-2 text-golf-blue">{category.title}</h3>
                      
                      {/* Description - visible on small screens and always visible */}
                      <p className="text-sm text-gray-600 text-center lg:hidden">{category.description}</p>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-golf-blue text-white">
                  {category.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
