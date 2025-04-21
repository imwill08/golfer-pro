import React from 'react';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";
import { X } from 'lucide-react';

// Custom dual range slider component
const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-100">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-blue-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-blue-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
DualRangeSlider.displayName = SliderPrimitive.Root.displayName;

export interface FilterOptions {
  experienceRange: [number, number];
  priceRange: [number, number];
  lessonTypes: string[];
  specializations: string[];
  certificates: string[];
}

interface InstructorFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const InstructorFilters: React.FC<InstructorFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const lessonTypeOptions = [
    { id: 'private', label: 'Private Lessons', description: 'One-on-one personalized instruction' },
    { id: 'group', label: 'Group Lessons', description: 'Learn with others in a group setting' },
    { id: 'online', label: 'Online Coaching', description: 'Virtual lessons and video analysis' },
    { id: 'oncourse', label: 'On-Course Instruction', description: 'Real-time guidance on the golf course' },
  ];

  const specializationOptions = [
    { id: 'beginner', label: 'Beginner Friendly', description: 'Perfect for new golfers' },
    { id: 'advanced', label: 'Advanced Techniques', description: 'For experienced players' },
    { id: 'putting', label: 'Putting Specialist', description: 'Focus on short game and putting' },
    { id: 'swing', label: 'Swing Analysis', description: 'Detailed swing mechanics' },
    { id: 'mental', label: 'Mental Game', description: 'Mental preparation and strategy' },
  ];

  const certificateOptions = [
    { id: 'pga', label: 'PGA Certified', description: 'Professional Golfers Association' },
    { id: 'lpga', label: 'LPGA Certified', description: 'Ladies Professional Golf Association' },
    { id: 'tpi', label: 'TPI Certified', description: 'Titleist Performance Institute' },
    { id: 'usgtf', label: 'USGTF Certified', description: 'United States Golf Teachers Federation' },
    { id: 'pgtaa', label: 'PGTAA Certified', description: 'Professional Golf Teachers Association of America' },
  ];

  const handleExperienceChange = (value: number[]) => {
    if (value.length === 2) {
      onFilterChange({
        ...filters,
        experienceRange: [value[0], value[1]],
      });
    }
  };

  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      onFilterChange({
        ...filters,
        priceRange: [value[0], value[1]],
      });
    }
  };

  const handleLessonTypeChange = (checked: boolean, type: string) => {
    const updatedTypes = checked
      ? [...filters.lessonTypes, type]
      : filters.lessonTypes.filter((t) => t !== type);
    onFilterChange({
      ...filters,
      lessonTypes: updatedTypes,
    });
  };

  const handleSpecializationChange = (checked: boolean, specialization: string) => {
    const updatedSpecializations = checked
      ? [...filters.specializations, specialization]
      : filters.specializations.filter((s) => s !== specialization);
    onFilterChange({
      ...filters,
      specializations: updatedSpecializations,
    });
  };

  const handleCertificateChange = (checked: boolean, certificate: string) => {
    const updatedCertificates = checked
      ? [...filters.certificates, certificate]
      : filters.certificates.filter((c) => c !== certificate);
    onFilterChange({
      ...filters,
      certificates: updatedCertificates,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      experienceRange: [0, 30],
      priceRange: [0, 200],
      lessonTypes: [],
      specializations: [],
      certificates: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 30) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.lessonTypes.length > 0) count += filters.lessonTypes.length;
    if (filters.specializations.length > 0) count += filters.specializations.length;
    if (filters.certificates.length > 0) count += filters.certificates.length;
    return count;
  };

  return (
    <div className="w-full lg:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </h2>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFilterCount()} active
              </Badge>
            )}
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['experience', 'price', 'certificates', 'lessonTypes', 'specializations']}
        className="px-4 py-2"
      >
        <AccordionItem value="experience" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Experience Level
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <DualRangeSlider
                value={[filters.experienceRange[0], filters.experienceRange[1]]}
                max={30}
                min={0}
                step={1}
                minStepsBetweenThumbs={1}
                onValueChange={handleExperienceChange}
                className="mb-2"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{filters.experienceRange[0]} years</span>
                <span>{filters.experienceRange[1]} years</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <DualRangeSlider
                value={[filters.priceRange[0], filters.priceRange[1]]}
                max={200}
                min={0}
                step={10}
                minStepsBetweenThumbs={10}
                onValueChange={handlePriceChange}
                className="mb-2"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certificates" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Certifications
            {filters.certificates.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.certificates.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-2">
              {certificateOptions.map((option) => (
                <TooltipProvider key={option.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`cert-${option.id}`}
                          checked={filters.certificates.includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleCertificateChange(checked as boolean, option.id)
                          }
                        />
                        <Label
                          htmlFor={`cert-${option.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lessonTypes" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Lesson Types
            {filters.lessonTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.lessonTypes.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-2">
              {lessonTypeOptions.map((option) => (
                <TooltipProvider key={option.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`lesson-${option.id}`}
                          checked={filters.lessonTypes.includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleLessonTypeChange(checked as boolean, option.id)
                          }
                        />
                        <Label
                          htmlFor={`lesson-${option.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specializations" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Specializations
            {filters.specializations.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.specializations.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-2">
              {specializationOptions.map((option) => (
                <TooltipProvider key={option.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${option.id}`}
                          checked={filters.specializations.includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleSpecializationChange(checked as boolean, option.id)
                          }
                        />
                        <Label
                          htmlFor={`spec-${option.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{option.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InstructorFilters; 