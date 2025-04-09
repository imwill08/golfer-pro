
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { InstructorDetails } from '@/types/instructor';

interface ProfileTabsProps {
  instructor: InstructorDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  instructor, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="w-full bg-white border rounded-md">
        <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
        <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
        <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
        <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Biography</h3>
                <p className="whitespace-pre-line">{instructor.bio}</p>
                <p className="mt-4 whitespace-pre-line">{instructor.additionalBio}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Specialties</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {instructor.specialties.map((specialty, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-2 w-2 bg-golf-green rounded-full mr-2"></span>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="services" className="mt-6">
        <div className="space-y-4">
          {instructor.services.map((service, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                    <span className="text-lg font-medium text-golf-blue">{service.price}</span>
                    <span className="text-sm text-gray-500">{service.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="faqs" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {instructor.faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="photos" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructor.photos.map((photo, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={photo}
                    alt={`${instructor.name} - photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
