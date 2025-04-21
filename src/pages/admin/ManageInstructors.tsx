import React, { useState } from 'react';
import { Search, Filter, Edit, Trash, Check, Clock, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Instructor {
  id: string;
  name: string;
  experience: number;
  specialization: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
}

interface ManageInstructorsProps {
  onEditInstructor?: (id: string) => void;
}

const ManageInstructors: React.FC<ManageInstructorsProps> = ({ onEditInstructor }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [instructorToDelete, setInstructorToDelete] = useState<string | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const { session } = useAuth();
  const itemsPerPage = 7;

  const { data: instructors, isLoading, error, refetch } = useQuery({
    queryKey: ['instructors', session?.access_token],
    queryFn: async () => {
      if (!session) {
        throw new Error('No active session');
      }
      
      console.log('Current user ID:', session.user.id);
      
      try {
        // First verify admin status - modified to handle multiple rows
        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id);
        
        console.log('Admin check result:', { adminCheck, adminError });
        
        if (adminError || !adminCheck || adminCheck.length === 0) {
          console.error('Admin verification failed:', adminError);
          throw new Error('Not authorized as admin');
        }

        const { data, error } = await supabase
          .from('instructors')
          .select('id, name, experience, specialization, status, location')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error fetching instructors:', error);
          throw new Error(error.message || 'Failed to fetch instructors');
        }
        
        console.log('Successfully fetched instructors:', data?.length);
        return data as Instructor[];
      } catch (err) {
        console.error('Exception in fetch instructors:', err);
        throw err;
      }
    },
    enabled: !!session,
    retry: 1
  });

  const approveInstructor = async (id: string, currentStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      if (!session?.user?.id) {
        throw new Error('No active session');
      }

      // First verify admin status - modified to handle multiple rows
      const { data: adminCheck, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id);
      
      console.log('Admin check result:', { adminCheck, adminError });
      
      if (adminError || !adminCheck || adminCheck.length === 0) {
        throw new Error('Not authorized as admin');
      }

      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      console.log('Setting new status to:', newStatus);

      const { data: updateData, error: updateError } = await supabase
        .from('instructors')
        .update({ 
          status: newStatus,
          is_approved: newStatus === 'approved'
        })
        .eq('id', id)
        .select();
      
      console.log('Update result:', { updateData, updateError });
      
      if (updateError) {
        console.error('Supabase error:', updateError);
        throw updateError;
      }

      if (!updateData || updateData.length === 0) {
        throw new Error('No rows were updated');
      }
      
      toast({
        title: currentStatus === 'approved' ? 'Instructor Unapproved' : 'Instructor Approved',
        description: `The instructor's status has been updated successfully.`,
      });
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['public-instructors'] });
    } catch (err) {
      console.error('Error updating instructor:', err);
      toast({
        title: 'Error',
        description: 'Failed to update instructor status. ' + (err.message || ''),
        variant: 'destructive',
      });
    }
  };

  const deleteInstructor = async () => {
    if (!instructorToDelete || !session?.user?.id) return;
    
    try {
      console.log('Starting deletion process for instructor:', instructorToDelete);
      console.log('Current user:', session.user.id);

      // First verify admin status - modified to handle multiple rows
      const { data: adminCheck, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id);
      
      console.log('Admin check result:', { adminCheck, adminError });

      if (adminError || !adminCheck || adminCheck.length === 0) {
        throw new Error('Not authorized as admin');
      }

      // First, delete related instructor stats if they exist
      const { data: statsData, error: statsError } = await supabase
        .from('instructor_stats')
        .delete()
        .eq('instructor_id', instructorToDelete)
        .select();
        
      console.log('Stats deletion result:', { statsData, statsError });

      if (statsError) {
        console.error('Error deleting instructor stats:', statsError);
      }

      // Delete any contact click logs associated with the instructor
      const { data: logsData, error: logsError } = await supabase
        .from('contact_click_logs')
        .delete()
        .eq('instructor_id', instructorToDelete)
        .select();
      
      console.log('Logs deletion result:', { logsData, logsError });

      if (logsError) {
        console.error('Error deleting contact logs:', logsError);
      }

      // Finally delete the instructor
      const { data: deleteData, error: deleteError } = await supabase
        .from('instructors')
        .delete()
        .eq('id', instructorToDelete)
        .select();
      
      console.log('Instructor deletion result:', { deleteData, deleteError });

      if (deleteError) {
        console.error('Supabase error:', deleteError);
        throw deleteError;
      }

      if (!deleteData || deleteData.length === 0) {
        throw new Error('No rows were deleted');
      }
      
      toast({
        title: 'Instructor Deleted',
        description: 'The instructor has been removed successfully.',
      });
      
      setInstructorToDelete(null);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['public-instructors'] });
    } catch (err) {
      console.error('Error deleting instructor:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete instructor. ' + (err.message || ''),
        variant: 'destructive',
      });
    }
  };

  const filteredInstructors = instructors?.filter(instructor => {
    if (showPendingOnly && instructor.status === 'approved') {
      return false;
    }
    
    return (
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const pendingCount = instructors?.filter(instructor => instructor.status === 'pending').length || 0;

  const totalPages = Math.ceil((filteredInstructors?.length || 0) / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (id: string) => {
    window.open(`/instructors/${id}`, '_blank');
  };

  const handleEdit = (id: string) => {
    if (onEditInstructor) {
      onEditInstructor(id);
    } else {
      navigate(`/admin/edit-instructor/${id}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Instructors</h1>
          {pendingCount > 0 && (
            <div className="mt-2 flex items-center">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 flex items-center gap-1">
                <AlertTriangle size={14} />
                {pendingCount} pending approval
              </Badge>
            </div>
          )}
        </div>
        
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
          
          <Button 
            variant={showPendingOnly ? "default" : "outline"} 
            className="flex items-center"
            onClick={() => setShowPendingOnly(!showPendingOnly)}
          >
            <Clock size={16} className="mr-2" />
            {showPendingOnly ? "All Instructors" : "Pending Only"}
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
          <div className="space-y-4 p-8">
            <Alert variant="destructive">
              <AlertDescription className="text-center">
                Error loading instructors. The database might not be properly configured or you may not have sufficient permissions.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[250px]">Location</TableHead>
                  <TableHead className="w-[120px]">Experience</TableHead>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[280px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInstructors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {showPendingOnly 
                        ? "No pending instructor applications found"
                        : "No instructors found"}
                    </TableCell>
                  </TableRow>
                ) :
                  paginatedInstructors.map((instructor) => (
                    <TableRow 
                      key={instructor.id} 
                      className={`hover:bg-gray-50 ${instructor.status !== 'approved' ? 'bg-yellow-50' : ''}`}
                    >
                      <TableCell className="font-medium">{instructor.name}</TableCell>
                      <TableCell>{instructor.location || 'N/A'}</TableCell>
                      <TableCell>{instructor.experience} Yrs</TableCell>
                      <TableCell>{instructor.specialization}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            instructor.status === 'approved'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {instructor.status === 'approved' ? <Check size={14} className="mr-1" /> : <Clock size={14} className="mr-1" />}
                          {instructor.status === 'approved' ? 'Active' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {instructor.status === 'approved' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => handleView(instructor.id)}
                            >
                              View
                            </Button>
                          )}
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
                            variant={instructor.status === 'approved' ? "destructive" : "default"} 
                            size="sm"
                            onClick={() => approveInstructor(instructor.id, instructor.status)}
                          >
                            {instructor.status === 'approved' ? 'Unapprove' : 'Approve'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="flex items-center"
                                onClick={() => setInstructorToDelete(instructor.id)}
                              >
                                <Trash size={14} className="mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the instructor 
                                  and all associated data including statistics.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setInstructorToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={deleteInstructor}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
    </div>
  );
};

export default ManageInstructors;
