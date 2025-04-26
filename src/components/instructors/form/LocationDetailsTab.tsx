import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';

interface LocationDetailsTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const LocationDetailsTab: React.FC<LocationDetailsTabProps> = ({ form, activeTab, onTabChange }) => {
  return (
    <TabsContent value="location" className="space-y-6 mt-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123 Golf Course Road" 
                    {...field} 
                    className="bg-gray-50 text-gray-800" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apt, Suite, Unit, Building, Floor, etc.</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Suite 100" 
                    {...field} 
                    className="bg-gray-50 text-gray-800" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="90210" {...field} className="bg-gray-50 text-gray-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="USA" {...field} className="bg-gray-50 text-gray-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="California" {...field} className="bg-gray-50 text-gray-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City or Locality <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Beverly Hills" {...field} className="bg-gray-50 text-gray-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={() => onTabChange("professional")}>
          Previous: Professional Info
        </Button>
        <Button type="button" onClick={() => onTabChange("specialties")}>
          Next: Specialties & FAQs
        </Button>
      </div>
    </TabsContent>
  );
}; 