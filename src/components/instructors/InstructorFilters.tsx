import React, { useState } from 'react';
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
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';

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
  specializations: string[];
  certificates: string[];
  lessonTypes: string[];
}

interface InstructorFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const InstructorFilters: React.FC<InstructorFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const specializationOptions = [
    { id: 'shortGame', label: 'Short Game' },
    { id: 'putting', label: 'Putting' },
    { id: 'driving', label: 'Driving' },
    { id: 'courseStrategy', label: 'Course Strategy' },
    { id: 'mentalApproach', label: 'Mental Approach' },
    { id: 'beginnerLessons', label: 'Beginner Lessons' },
    { id: 'advancedTraining', label: 'Advanced Training' },
    { id: 'juniorCoaching', label: 'Junior Coaching' }
  ];

  const certificateOptions = [
    { id: 'pga', label: 'PGA Certified' },
    { id: 'lpga', label: 'LPGA Certified' },
    { id: 'tpi', label: 'TPI Certified' },
    { id: 'other', label: 'Other Certification' }
  ];

  const [otherCertification, setOtherCertification] = useState('');

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

  const handleSpecializationChange = (checked: boolean, specialization: string) => {
    const optionLabel = specializationOptions.find(opt => opt.id === specialization)?.label;
    if (!optionLabel) return;

    const updatedSpecializations = checked
      ? [...filters.specializations, optionLabel]
      : filters.specializations.filter((s) => s !== optionLabel);

    onFilterChange({
      ...filters,
      specializations: updatedSpecializations,
    });
  };

  const handleCertificateChange = (checked: boolean, certificate: string) => {
    let updatedCertificates = checked
      ? [...filters.certificates, certificate]
      : filters.certificates.filter((c) => c !== certificate);

    // If unchecking 'other', remove any custom certification
    if (!checked && certificate === 'other') {
      updatedCertificates = updatedCertificates.filter(cert => 
        ['pga', 'lpga', 'tpi', 'other'].includes(cert)
      );
      setOtherCertification('');
    }

    onFilterChange({
      ...filters,
      certificates: updatedCertificates,
    });
  };

  const handleOtherCertificationChange = (value: string) => {
    setOtherCertification(value);
    const updatedCertificates = filters.certificates.filter(cert => 
      ['pga', 'lpga', 'tpi', 'other'].includes(cert)
    );
    
    if (value) {
      updatedCertificates.push(value);
    }

    onFilterChange({
      ...filters,
      certificates: updatedCertificates,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 30) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.specializations.length > 0) count += filters.specializations.length;
    if (filters.certificates.length > 0) count += filters.certificates.length;
    return count;
  };

  return (
    <div className="w-full lg:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Accordion
        type="multiple"
        defaultValue={['experience', 'price', 'certificates', 'specializations']}
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
                max={1000}
                min={0}
                step={50}
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
                <div key={option.id} className="flex items-center space-x-2">
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
              ))}
              
              {/* Show input field when Other is selected */}
              {filters.certificates.includes('other') && (
                <div className="mt-2 pl-6">
                  <Input
                    type="text"
                    placeholder="Enter certification name"
                    value={otherCertification}
                    onChange={(e) => handleOtherCertificationChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specializations" className="border-b-0">
          <AccordionTrigger className="text-sm py-3 hover:no-underline">
            Specialties
            {filters.specializations.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {filters.specializations.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-2">
              {specializationOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spec-${option.id}`}
                    checked={filters.specializations.includes(option.label)}
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
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InstructorFilters; 