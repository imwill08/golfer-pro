import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface SpecialtiesTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SpecialtiesTab: React.FC<SpecialtiesTabProps> = ({ form, activeTab, onTabChange }) => {
  const { register, watch, setValue } = useFormContext<InstructorFormValues>();
  const faqs = watch('faqs') || [];

  const addFaq = () => {
    const currentFaqs = Array.isArray(faqs) ? faqs : [];
    setValue('faqs', [...currentFaqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    const currentFaqs = Array.isArray(faqs) ? faqs : [];
    setValue(
      'faqs',
      currentFaqs.filter((_, i) => i !== index)
    );
  };

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
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">FAQs</h3>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <Button type="button" onClick={addFaq} variant="outline">
              Add FAQ
            </Button>
          </div>
          
          <div className="space-y-4">
            {faqs.map((_, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Question</Label>
                    <Input {...register(`faqs.${index}.question`)} placeholder="Enter question" />
                    <Label>Answer</Label>
                    <Textarea {...register(`faqs.${index}.answer`)} placeholder="Enter answer" />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeFaq(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={() => onTabChange("lesson_types")}>
          Previous: Lesson Types
        </Button>
        <Button type="button" onClick={() => onTabChange("photos")}>
          Next: Photos
        </Button>
      </div>
    </TabsContent>
  );
};
