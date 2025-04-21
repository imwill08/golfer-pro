
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';

interface SpecialtiesTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SpecialtiesTab: React.FC<SpecialtiesTabProps> = ({ form, activeTab, onTabChange }) => {
  return (
    <TabsContent value="specialties" className="space-y-6 mt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Specialties <span className="text-red-500">*</span></h3>
        <p className="text-sm text-gray-500">Select all areas where you have specialized expertise.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="specialties.shortGame"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Short Game</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.putting"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Putting</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.driving"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Driving</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.courseStrategy"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Course Strategy</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.mentalApproach"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Mental Approach</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.beginnerLessons"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Beginner Lessons</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.advancedTraining"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Advanced Training</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties.juniorCoaching"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Junior Coaching</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
        <p className="text-sm text-gray-500">Help potential clients understand what to expect when working with you.</p>
        
        <FormField
          control={form.control}
          name="faqs.equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do students need to bring their own equipment?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Yes, please bring your own clubs. However, I can provide equipment for beginners if needed." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="faqs.numberOfLessons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many lessons will students typically need?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="It varies based on your goals and current skill level. Most students see significant improvement after 3-5 lessons." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="faqs.packages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you offer lesson packages or discounts?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Yes, I offer package discounts for multiple lessons. A 5-lesson package includes a 10% discount from the individual lesson price." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={() => onTabChange("services")}>
          Previous: Services
        </Button>
        <Button type="button" onClick={() => onTabChange("photos")}>
          Next: Photos
        </Button>
      </div>
    </TabsContent>
  );
};
