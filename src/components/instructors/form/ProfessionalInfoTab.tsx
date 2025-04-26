import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfessionalInfoTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({ form, activeTab, onTabChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  return (
    <TabsContent value="professional" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="yearStarted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Started Coaching <span className="text-red-500">*</span></FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground">
                Select the year you started coaching
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0 pl-4">PGA Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.lpga"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0 pl-4">LPGA Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.tpi"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0 pl-4">TPI Certified</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certifications.other"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0 pl-4">Other Certification</FormLabel>
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
        <Button type="button" onClick={() => onTabChange("location")}>
          Next: Location Details
        </Button>
      </div>
    </TabsContent>
  );
};
