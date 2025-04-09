import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchHero = () => {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-16">
        Find the Best Golf Instructors<br />Near You
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 p-2 rounded-full shadow-lg bg-white">
          <div className="flex items-center gap-2 flex-1 pl-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zip Code"
              className="w-full outline-none text-lg"
            />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] border-0">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="beginner">Beginner Lessons</SelectItem>
              <SelectItem value="advanced">Advanced Training</SelectItem>
              <SelectItem value="pro">Pro Coaching</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="lg" className="rounded-full px-8">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHero; 