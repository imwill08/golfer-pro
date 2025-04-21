
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';

interface ServicesTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ form, activeTab, onTabChange }) => {
  return (
    <TabsContent value="services" className="space-y-6 mt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lesson Types <span className="text-red-500">*</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="lessonTypes.privateLesson"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Private Lessons</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lessonTypes.groupLessons"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Group Lessons</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lessonTypes.onlineCoaching"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">Online Coaching</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lessonTypes.oncourseInstruction"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel className="!m-0">On-Course Instruction</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Service details for each selected service type */}
      
      {form.watch('lessonTypes.privateLesson') && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-md font-medium mb-4">Private Lesson Details <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="services.privateLesson.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.privateLesson.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="60 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.privateLesson.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="1-on-1 lessons tailored to your specific needs. Includes video analysis and personalized drills." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {form.watch('lessonTypes.groupLessons') && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-md font-medium mb-4">Group Lesson Details <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="services.groupLessons.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$70 per person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.groupLessons.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="90 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.groupLessons.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Learn with friends or family in a small group setting. Perfect for beginners." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {form.watch('lessonTypes.onlineCoaching') && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-md font-medium mb-4">Online Coaching Details <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="services.onlineCoaching.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.onlineCoaching.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="45 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.onlineCoaching.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Remote coaching via video. Send swing videos for analysis and receive feedback and drills." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {form.watch('lessonTypes.oncourseInstruction') && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-md font-medium mb-4">On-Course Instruction Details <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="services.oncourseInstruction.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$180" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.oncourseInstruction.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="2 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.oncourseInstruction.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Real-world application of skills on the course. Includes strategy and course management." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {form.watch('lessonTypes.advancedTraining') && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h4 className="text-md font-medium mb-4">Advanced Training Details <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="services.advancedTraining.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.advancedTraining.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="90 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services.advancedTraining.description"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specialized training for experienced golfers looking to take their game to the next level." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
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
