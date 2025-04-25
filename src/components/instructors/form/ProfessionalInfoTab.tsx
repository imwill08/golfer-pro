import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';

interface ProfessionalInfoTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({ form, activeTab, onTabChange }) => {
  return (
    <TabsContent value="professional" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Enhanced location fields */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Location Details</h3>
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
        
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Helping golfers master their swing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialties <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Swing Analysis Specialist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Bio <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                rows={4} 
                placeholder="Tell us about your golf teaching experience, philosophy, and what makes you a great instructor..."
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="additionalBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Bio Information (optional)</FormLabel>
            <FormControl>
              <Textarea 
                rows={3}
                placeholder="Any additional qualifications, awards or specializations you'd like to highlight..."
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Certifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="certifications.pga"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">PGA Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.lpga"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">LPGA Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.tpi"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">TPI Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.other"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Other Certification</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch('certifications.other') && (
            <FormField
              control={form.control}
              name="certifications.otherText"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input placeholder="Please specify certification(s)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={() => onTabChange("personal")}>
          Previous: Personal Info
        </Button>
        <Button type="button" onClick={() => onTabChange("lesson_types")}>
          Next: Lesson Types
        </Button>
      </div>
    </TabsContent>
  );
};
