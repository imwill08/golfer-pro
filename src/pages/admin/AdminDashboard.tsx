
import React, { useState, useEffect } from 'react';
import { Users, Award, Clock, Activity } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import { supabase } from '@/integrations/supabase/client';

// Activity item type definition
interface ActivityItem {
  id: number;
  instructorName: string;
  action: string;
  date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    newRequests: 0,
    activeInstructors: 0,
    totalCategories: 8, // This is fixed for now as we don't have a categories table
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total instructors
      const { data: totalInstructors, error: totalError } = await supabase
        .from('instructors')
        .select('id')
        .throwOnError();
      
      // Fetch new requests (instructors waiting approval)
      const { data: newRequests, error: newRequestsError } = await supabase
        .from('instructors')
        .select('id')
        .eq('approved', false)
        .throwOnError();
      
      // Fetch active instructors
      const { data: activeInstructors, error: activeError } = await supabase
        .from('instructors')
        .select('id')
        .eq('approved', true)
        .throwOnError();
      
      // Fetch recent instructor data for activity
      const { data: recentInstructors, error: recentError } = await supabase
        .from('instructors')
        .select('id, name, approved, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10)
        .throwOnError();
      
      // Update stats
      setStats({
        totalInstructors: totalInstructors?.length || 0,
        newRequests: newRequests?.length || 0,
        activeInstructors: activeInstructors?.length || 0,
        totalCategories: 8, // Fixed value for now
      });
      
      // Transform recent instructors data into activity items
      if (recentInstructors) {
        const activityItems: ActivityItem[] = [];
        let activityId = 1;
        
        recentInstructors.forEach((instructor) => {
          // Check if the created_at and updated_at timestamps are close (within 5 minutes)
          const createdAt = new Date(instructor.created_at);
          const updatedAt = new Date(instructor.updated_at);
          const diffInMinutes = Math.abs((updatedAt.getTime() - createdAt.getTime()) / (1000 * 60));
          
          if (diffInMinutes < 5) {
            // This is likely a new instructor
            activityItems.push({
              id: activityId++,
              instructorName: instructor.name,
              action: 'New instructor added',
              date: formatTimeAgo(createdAt),
            });
          } else {
            // This is an update
            activityItems.push({
              id: activityId++,
              instructorName: instructor.name,
              action: instructor.approved ? 'Status changed to active' : 'Profile updated',
              date: formatTimeAgo(updatedAt),
            });
          }
        });
        
        setRecentActivity(activityItems);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to format timestamp to relative time (e.g., "2 hours ago")
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Instructors"
                value={stats.totalInstructors}
                icon={Users}
                iconColor="bg-blue-100 text-blue-500"
                change={{ value: "12%", positive: true }}
              />
              
              <StatCard
                title="New Requests"
                value={stats.newRequests}
                icon={Award}
                iconColor="bg-yellow-100 text-yellow-500"
                change={{ value: "5%", positive: true }}
              />
              
              <StatCard
                title="Active Instructors"
                value={stats.activeInstructors}
                icon={Clock}
                iconColor="bg-green-100 text-green-500"
                change={{ value: "3%", positive: false }}
              />
              
              <StatCard
                title="Total Categories"
                value={stats.totalCategories}
                icon={Activity}
                iconColor="bg-purple-100 text-purple-500"
              />
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            
            {loading ? (
              <div className="divide-y">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="flex justify-between">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="divide-y">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{activity.instructorName}</h3>
                      <p className="text-gray-500 text-sm">{activity.action}</p>
                    </div>
                    <div className="text-gray-400 text-sm">{activity.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activity found
              </div>
            )}
            
            {recentActivity.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <button 
                  onClick={() => fetchDashboardData()} 
                  className="text-golf-blue font-medium hover:underline"
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
