import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { InstructorFormValues } from '@/types/instructor';
import { cn } from '@/lib/utils';

interface PhotosTabProps {
  form: UseFormReturn<InstructorFormValues>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  profilePhotoPreview: string | null;
  setProfilePhotoPreview: (value: string | null) => void;
  additionalPhotos: string[];
  handleProfilePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAdditionalPhotosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAdditionalPhoto: (index: number) => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({ 
  form, 
  activeTab, 
  onTabChange, 
  profilePhotoPreview, 
  setProfilePhotoPreview,
  additionalPhotos,
  handleProfilePhotoChange,
  handleAdditionalPhotosChange,
  removeAdditionalPhoto
}) => {
  // Existing profile photo from the database
  const existingProfilePhoto = form.watch('photos')?.[0] || null;
  // Existing gallery photos from the database
  const existingGalleryPhotos = form.watch('gallery_photos') || [];

  const [isProfileDragActive, setIsProfileDragActive] = useState(false);
  const [isGalleryDragActive, setIsGalleryDragActive] = useState(false);

  // Add a function to clear both form value and preview
  const handleRemoveProfilePhoto = () => {
    form.setValue('profilePhoto', null);
    setProfilePhotoPreview(null);
  };

  // Drag and drop handlers for profile photo
  const handleProfileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsProfileDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleProfilePhotoChange(event);
    }
  };
  const handleProfileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsProfileDragActive(true);
  };
  const handleProfileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsProfileDragActive(false);
  };

  // Drag and drop handlers for gallery photos
  const handleGalleryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsGalleryDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleAdditionalPhotosChange(event);
    }
  };
  const handleGalleryDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsGalleryDragActive(true);
  };
  const handleGalleryDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsGalleryDragActive(false);
  };

  return (
    <TabsContent value="photos" className="space-y-8 mt-6">
      <div className="space-y-12">
        {/* Profile Photo Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
              <p className="text-sm text-muted-foreground">
                Upload a professional photo of yourself
              </p>
            </div>
            {profilePhotoPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/90"
                onClick={handleRemoveProfilePhoto}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="relative group ">
            <div
              className={cn(
                "w-[220px] aspect-square border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200",
                "hover:border-primary/50 focus-within:border-primary/50",
                (profilePhotoPreview || existingProfilePhoto) ? "border-muted" : "border-muted/50",
                isProfileDragActive ? "border-primary bg-primary/10" : ""
              )}
              onDrop={handleProfileDrop}
              onDragOver={handleProfileDragOver}
              onDragLeave={handleProfileDragLeave}
            >
              <label 
                htmlFor="profile-photo"
                className="block cursor-pointer"
              >
                {profilePhotoPreview ? (
                  <img 
                    src={profilePhotoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : existingProfilePhoto ? (
                  <img 
                    src={existingProfilePhoto} 
                    alt="Existing profile photo" 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center  h-full text-center p-4">
                    <div className="mb-10"> </div>
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground mb-1">Upload Profile Photo</p>
                    <p className="text-xs text-muted-foreground">Drag and drop or click to select</p>
                  </div>
                )}
                <Input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                  aria-label="Upload profile photo"
                />
              </label>
            </div>

            <div className="mt-4 p-4 bg-muted/10 rounded-lg border border-muted">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">Photo requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                    <li>Professional appearance</li>
                    <li>Clear face shot (head and shoulders)</li>
                    <li>Good lighting</li>
                    <li>Maximum file size: 5MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Photos Section */}
        <section className="space-y-4 max-w-4xl">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gallery Photos</h3>
            <p className="text-sm text-muted-foreground">
              Upload photos of you teaching or in action
            </p>
          </div>

          <div className="space-y-4">
            <div className={cn(
              "border-2 border-dashed rounded-xl p-6 transition-all duration-200",
              "hover:border-primary/50 focus-within:border-primary/50",
              (additionalPhotos.length > 0 || existingGalleryPhotos.length > 0) ? "border-muted" : "border-muted/50",
              isGalleryDragActive ? "border-primary bg-primary/10" : ""
            )}
            onDrop={handleGalleryDrop}
            onDragOver={handleGalleryDragOver}
            onDragLeave={handleGalleryDragLeave}
            >
              <Label 
                htmlFor="gallery-photos" 
                className="flex flex-col items-center justify-center cursor-pointer text-center"
              >
                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {(additionalPhotos.length > 0 || existingGalleryPhotos.length > 0) 
                    ? 'Add more gallery photos' 
                    : 'Upload gallery photos'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or click to select
                </p>
                <Input
                  id="gallery-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAdditionalPhotosChange}
                  aria-label="Upload gallery photos"
                />
              </Label>
            </div>

            {/* Display new selected photos */}
            {additionalPhotos.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">New photos to upload:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {additionalPhotos.map((photo, index) => (
                    <div 
                      key={`new-${index}`} 
                      className="group relative aspect-square rounded-lg overflow-hidden border border-muted"
                    >
                      <img 
                        src={photo} 
                        alt={`New gallery photo ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          type="button"
                          onClick={() => removeAdditionalPhoto(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                          aria-label={`Remove gallery photo ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display existing gallery photos */}
            {existingGalleryPhotos.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Existing gallery photos:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingGalleryPhotos.map((photo, index) => (
                    <div 
                      key={`existing-${index}`} 
                      className="group relative aspect-square rounded-lg overflow-hidden border border-muted"
                    >
                      <img 
                        src={photo} 
                        alt={`Existing gallery photo ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-4 border-t border-muted">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onTabChange("specialties")}
          className="order-2 sm:order-1"
        >
          Previous: Specialties
        </Button>
        <Button 
          type="button" 
          onClick={() => onTabChange("lesson_types")}
          className="order-1 sm:order-2"
        >
          Next: Lesson Types
        </Button>
      </div>
    </TabsContent>
  );
};
