import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';

interface PersonalInfoTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ form, activeTab, onTabChange }) => {
  return (
    <TabsContent value="personal" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">First Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Last Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-medium">Website (optional)</FormLabel>
              <FormControl>
                <Input placeholder="johndoegolf.com" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onTabChange("photos")}
          className="w-full md:w-auto order-2 md:order-1"
        >
          Previous: Photos
        </Button>
        <Button 
          type="button" 
          onClick={() => onTabChange("professional")}
          className="w-full md:w-auto order-1 md:order-2"
        >
          Next: Professional Info
        </Button>
      </div>
    </TabsContent>
  );
};
