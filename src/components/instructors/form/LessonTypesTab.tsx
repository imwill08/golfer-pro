import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';
import { X, Plus, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface LessonTypesTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MAX_LESSON_TYPES = 3;

export const LessonTypesTab: React.FC<LessonTypesTabProps> = ({ form, activeTab, onTabChange }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [contactForPrice, setContactForPrice] = useState(false);

  const addLessonType = () => {
    if (!newTitle.trim() || !newDescription.trim() || (!contactForPrice && !newPrice.trim())) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the lesson type.",
        variant: "destructive"
      });
      return;
    }

    const currentLessonTypes = form.getValues('lesson_types') || [];
    
    if (currentLessonTypes.length >= MAX_LESSON_TYPES) {
      toast({
        title: "Maximum Limit Reached",
        description: `You can only add up to ${MAX_LESSON_TYPES} lesson types.`,
        variant: "destructive"
      });
      return;
    }

    let priceDisplay = contactForPrice ? 'Contact for price' : `$${newPrice.trim()}`;
    const formattedTitle = `${newTitle.trim()}${newDuration.trim() ? ` (${newDuration.trim()}` : ''}${newDuration.trim() ? ' - ' : ' ('}${priceDisplay})`;

    form.setValue('lesson_types', [
      ...(Array.isArray(currentLessonTypes) ? currentLessonTypes : []),
      {
        title: formattedTitle,
        description: newDescription.trim(),
        duration: newDuration.trim(),
        price: contactForPrice ? null : (Number(newPrice.replace(/[^0-9.]/g, '')) || 0),
        contactForPrice: contactForPrice
      }
    ]);

    setNewTitle('');
    setNewDescription('');
    setNewDuration('');
    setNewPrice('');
    setContactForPrice(false);

    toast({
      title: "Lesson Type Added",
      description: "Your lesson type has been successfully added.",
    });
  };

  const removeLessonType = (index: number) => {
    const currentLessonTypes = form.getValues('lesson_types') || [];
    
    if (!Array.isArray(currentLessonTypes)) {
      form.setValue('lesson_types', []);
      return;
    }

    form.setValue('lesson_types', currentLessonTypes.filter((_, i) => i !== index));
    toast({
      title: "Lesson Type Removed",
      description: "The lesson type has been removed.",
    });
  };

  const hasValidNewLesson = () => {
    return newTitle.trim() && newDescription.trim() && (contactForPrice || newPrice.trim());
  };

  const existingLessonTypes = Array.isArray(form.watch('lesson_types')) 
    ? form.watch('lesson_types') 
    : [];

  const handleNextTab = () => {
    if (!existingLessonTypes.length) {
      toast({
        title: "Missing Lesson Type",
        description: "Please add at least one lesson type before continuing.",
        variant: "destructive"
      });
      return;
    }
    onTabChange("specialties");
  };

  React.useEffect(() => {
    const currentLessonTypes = form.getValues('lesson_types');
    if (!Array.isArray(currentLessonTypes)) {
      form.setValue('lesson_types', []);
    }
  }, [form]);

  return (
    <TabsContent value="lesson_types" className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Lesson Types</h3>
            <p className="text-sm text-gray-500">
              Add between 1 and {MAX_LESSON_TYPES} types of lessons you offer.
              Currently added: {existingLessonTypes.length}/{MAX_LESSON_TYPES}
            </p>
          </div>
        </div>

        {existingLessonTypes.length < MAX_LESSON_TYPES && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormItem>
                    <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., Private Lesson"
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input 
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="e.g., 60 minutes"
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="e.g., 100"
                          type="number"
                          min="0"
                          disabled={contactForPrice}
                        />
                        <label className="flex items-center gap-2 text-sm mt-1">
                          <Checkbox
                            checked={contactForPrice}
                            onCheckedChange={(checked) => {
                              setContactForPrice(!!checked);
                              if (checked) setNewPrice('');
                            }}
                            id="contact-for-price"
                          />
                          Contact for price
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                </div>

                <FormItem>
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe what's included in this lesson type..."
                    />
                  </FormControl>
                </FormItem>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addLessonType}
                    disabled={!hasValidNewLesson()}
                    className="w-full md:w-auto"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Another Lesson
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {existingLessonTypes.length > 0 && (
          <>
            <div className="space-y-4">
              {existingLessonTypes.map((lessonType, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium">Title</h4>
                            <p className="text-gray-600">{lessonType.title}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Duration</h4>
                            <p className="text-gray-600">{lessonType.duration}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Price</h4>
                            <p className="text-gray-600">{lessonType.contactForPrice ? 'Contact for price' : `$${lessonType.price}`}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-gray-600">{lessonType.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLessonType(index)}
                        className="absolute top-4 right-4"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => onTabChange("photos")}>
                Previous: Photos
              </Button>
            </div>
          </>
        )}

        {existingLessonTypes.length === 0 && !hasValidNewLesson() && (
          <div className="text-center text-gray-500 mt-4">
            <p>Please add at least one lesson type to continue.</p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}; 