import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InstructorFormValues } from '@/types/instructor';

interface InstructorFormProps {
  onSubmit: (data: InstructorFormValues) => void;
  isAdmin?: boolean;
  buttonText?: string;
  initialValues?: InstructorFormValues;
}

const InstructorForm: React.FC<InstructorFormProps> = ({ 
  onSubmit, 
  isAdmin = false, 
  buttonText = "Submit Application",
  initialValues 
}) => {
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<InstructorFormValues>({
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      website: '',
      experience: 0,
      location: '',
      tagline: '',
      specialization: '',
      bio: '',
      additionalBio: '',
      certifications: {
        pga: false,
        lpga: false,
        tpi: false,
        other: false,
        otherText: ''
      },
      lessonTypes: {
        privateLesson: false,
        groupLessons: false,
        onlineCoaching: false,
        oncourseInstruction: false
      },
      services: {},
      specialties: {
        shortGame: false,
        putting: false,
        driving: false,
        courseStrategy: false,
        mentalApproach: false,
        beginnerLessons: false,
        advancedTraining: false,
        juniorCoaching: false
      },
      faqs: {},
      profilePhoto: null,
      additionalPhotos: null
    }
  });
  
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAdditionalPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      form.setValue('additionalPhotos', files);
      
      const newPreviews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setAdditionalPhotos(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleFormSubmit = (data: InstructorFormValues) => {
    onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="specialties">Specialties & FAQs</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          {/* PERSONAL INFORMATION TAB */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoegolf.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setActiveTab("photos")}>
                Previous: Photos
              </Button>
              <Button type="button" onClick={() => setActiveTab("professional")}>
                Next: Professional Info
              </Button>
            </div>
          </TabsContent>
          
          {/* PROFESSIONAL INFORMATION TAB */}
          <TabsContent value="professional" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City, State)</FormLabel>
                    <FormControl>
                      <Input placeholder="Austin, TX" {...field} />
                    </FormControl>
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
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
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
                  <FormLabel>Professional Bio</FormLabel>
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
              <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                Previous: Personal Info
              </Button>
              <Button type="button" onClick={() => setActiveTab("services")}>
                Next: Services
              </Button>
            </div>
          </TabsContent>
          
          {/* SERVICES TAB */}
          <TabsContent value="services" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lesson Types</h3>
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
                  <h4 className="text-md font-medium mb-4">Private Lesson Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="services.privateLesson.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                          <FormLabel>Duration</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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
                  <h4 className="text-md font-medium mb-4">Group Lesson Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="services.groupLessons.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                          <FormLabel>Duration</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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
                  <h4 className="text-md font-medium mb-4">Online Coaching Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="services.onlineCoaching.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                          <FormLabel>Duration</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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
                  <h4 className="text-md font-medium mb-4">On-Course Instruction Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="services.oncourseInstruction.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                          <FormLabel>Duration</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setActiveTab("professional")}>
                Previous: Professional Info
              </Button>
              <Button type="button" onClick={() => setActiveTab("specialties")}>
                Next: Specialties & FAQs
              </Button>
            </div>
          </TabsContent>
          
          {/* SPECIALTIES & FAQS TAB */}
          <TabsContent value="specialties" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Specialties</h3>
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
                      <FormLabel className="!m-0">Driving Distance</FormLabel>
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
              
              <FormField
                control={form.control}
                name="faqs.equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What equipment should students bring to their first lesson?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="For your first lesson, just bring your current clubs. No need for anything special. If you're a beginner without clubs, I can provide rental clubs for our session."
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
                    <FormLabel>How many lessons do most students take?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Most students see significant improvement after 3-5 lessons. However, this varies based on your goals and starting skill level. We'll discuss a recommended plan after our first session."
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
                    <FormLabel>Do you offer packages or discounts for multiple lessons?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Yes, I offer packages of 5 or 10 lessons with a 10-15% discount. This is a great option for committed players looking for consistent improvement."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setActiveTab("services")}>
                Previous: Services
              </Button>
              <Button type="button" onClick={() => setActiveTab("photos")}>
                Next: Photos
              </Button>
            </div>
          </TabsContent>
          
          {/* PHOTOS TAB */}
          <TabsContent value="photos" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Photo</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {profilePhotoPreview ? (
                  <div className="relative mb-4">
                    <img 
                      src={profilePhotoPreview} 
                      alt="Profile preview" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => {
                        setProfilePhotoPreview(null);
                        form.setValue('profilePhoto', null);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <Upload size={32} className="text-gray-400" />
                  </div>
                )}
                
                <Label 
                  htmlFor="profile-photo-upload" 
                  className="bg-gray-100 py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {profilePhotoPreview ? "Change photo" : "Select photo"}
                </Label>
                <Input 
                  id="profile-photo-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleProfilePhotoChange}
                />
                <p className="text-xs text-gray-400 mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-medium">Additional Photos (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {additionalPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {additionalPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={photo} 
                          alt={`Additional photo ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                      <Plus size={32} className="text-gray-400" />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Label 
                    htmlFor="additional-photos-upload" 
                    className="bg-gray-100 py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {additionalPhotos.length > 0 ? "Add more photos" : "Add photos"}
                  </Label>
                  <Input 
                    id="additional-photos-upload"
                    type="file" 
                    accept="image/*"
                    multiple
                    className="hidden" 
                    onChange={handleAdditionalPhotosChange}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Add photos of you teaching, swing demonstrations, or your teaching facility</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setActiveTab("specialties")}>
                Previous: Specialties & FAQs
              </Button>
              <Button type="button" onClick={() => setActiveTab("personal")}>
                Next: Personal Info
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InstructorForm;
