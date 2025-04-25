import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

interface InstructorSearchBarProps {
  onSearch: (searchTerm: string) => void;
  className?: string;
}

const InstructorSearchBar: React.FC<InstructorSearchBarProps> = ({
  onSearch,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Use debounced callback instead of useEffect
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      onSearch(value);
    },
    300
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex w-full max-w-3xl mx-auto",
        className
      )}
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search by name, location, specialization, lesson type..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Button 
        type="submit"
        className="ml-2"
      >
        Search
      </Button>
    </form>
  );
};

export default InstructorSearchBar; 