import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManageInstructors from './ManageInstructors';
import EditInstructor from './EditInstructor';

const AdminInstructors = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const handleEditInstructor = (id: string) => {
    setSelectedInstructorId(id);
    setActiveTab('edit');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manage">Manage Instructors</TabsTrigger>
        <TabsTrigger value="edit" disabled={!selectedInstructorId}>
          Edit Instructor
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="manage">
        <ManageInstructors onEditInstructor={handleEditInstructor} />
      </TabsContent>
      
      <TabsContent value="edit">
        {selectedInstructorId && (
          <EditInstructor 
            instructorId={selectedInstructorId} 
            onCancel={() => setActiveTab('manage')} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AdminInstructors;
