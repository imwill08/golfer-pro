
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UserPlus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Instructors', path: '/admin/instructors' },
    { icon: UserPlus, label: 'Add Instructor', path: '/admin/add-instructor' },
  ];

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully',
      });
      navigate('/admin/login');
    }
  };

  return (
    <div className="bg-sidebar h-screen w-64 flex-shrink-0 flex flex-col">
      <div className="p-6 mb-6">
        <Link to="/admin" className="text-white text-2xl font-bold">LOGO</Link>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center py-3 px-6 hover:bg-sidebar-accent transition-colors",
                    isActive ? "bg-sidebar-accent text-white" : "text-white/80"
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center py-3 px-6 w-full text-white/80 hover:bg-sidebar-accent hover:text-white transition-colors rounded-md"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
