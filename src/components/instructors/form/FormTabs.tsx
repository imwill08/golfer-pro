import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export const FormTabs: React.FC<FormTabsProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <TabsList className="w-full inline-flex md:grid md:grid-cols-5 min-w-max md:min-w-0 border-b md:border-none">
          <TabsTrigger 
            value="personal" 
            className="min-w-[130px] md:min-w-0 px-4 py-2 text-sm"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger 
            value="professional" 
            className="min-w-[130px] md:min-w-0 px-4 py-2 text-sm"
          >
            Professional
          </TabsTrigger>
          <TabsTrigger 
            value="lesson_types" 
            className="min-w-[130px] md:min-w-0 px-4 py-2 text-sm"
          >
            Lesson Types
          </TabsTrigger>
          <TabsTrigger 
            value="specialties" 
            className="min-w-[130px] md:min-w-0 px-4 py-2 text-sm"
          >
            Specialties & FAQs
          </TabsTrigger>
          <TabsTrigger 
            value="photos" 
            className="min-w-[130px] md:min-w-0 px-4 py-2 text-sm"
          >
            Photos
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
};
