
import React, { useState } from 'react';
import { Search, Filter, Edit, Check, Clock } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface Instructor {
  id: string;
  name: string;
  experience: number;
  specialization: string;
  approved: boolean | null;
}

const ManageInstructors = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch instructors data
  const { data: instructors, isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('id, name, experience, specialization, approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Instructor[];
    }
  });

  // Handle instructor approval
  const approveInstructor = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('instructors')
        .update({ approved: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: currentStatus ? 'Instructor Unapproved' : 'Instructor Approved',
        description: `The instructor's status has been updated successfully.`,
      });
      
      // Invalidate and refetch both admin and public instructor queries
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['public-instructors'] });
    } catch (err) {
      console.error('Error updating instructor:', err);
      toast({
        title: 'Error',
        description: 'Failed to update instructor status.',
        variant: 'destructive',
      });
    }
  };

  // Filter instructors based on search term
  const filteredInstructors = instructors?.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const totalPages = Math.ceil((filteredInstructors?.length || 0) / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Navigate to edit instructor page
  const handleEdit = (id: string) => {
    navigate(`/admin/edit-instructor/${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Instructors</h1>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search instructors..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-golf-blue border-r-transparent"></div>
                <p className="mt-2">Loading instructors...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                Error loading instructors. Please try again.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInstructors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No instructors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedInstructors.map((instructor) => (
                        <TableRow key={instructor.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{instructor.name}</TableCell>
                          <TableCell>{instructor.experience} Yrs</TableCell>
                          <TableCell>{instructor.specialization}</TableCell>
                          <TableCell>
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                instructor.approved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {instructor.approved ? <Check size={14} className="mr-1" /> : <Clock size={14} className="mr-1" />}
                              {instructor.approved ? 'Active' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center"
                                onClick={() => handleEdit(instructor.id)}
                              >
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant={instructor.approved ? "destructive" : "default"} 
                                size="sm"
                                onClick={() => approveInstructor(instructor.id, instructor.approved)}
                              >
                                {instructor.approved ? 'Unapprove' : 'Approve'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {filteredInstructors.length > 0 && (
              <div className="p-4 border-t bg-gray-50 flex justify-center">
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Button 
                        key={pageNumber}
                        size="sm" 
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  {totalPages > 3 && currentPage < totalPages && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageInstructors;
