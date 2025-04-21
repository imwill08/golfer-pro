import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { AuthProvider } from '@/hooks/use-auth';
import HomePage from '@/pages/HomePage';
import InstructorProfilePage from '@/pages/InstructorProfilePage';
import JoinInstructorPage from '@/pages/JoinInstructorPage';
import InstructorsPage from '@/pages/InstructorsPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminInstructors from '@/pages/admin/AdminInstructors';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/NotFound';
import EditInstructor from '@/pages/admin/EditInstructor';
import '@/styles/scrollbar-hide.css';

// Import static pages
import AboutUs from '@/pages/static/AboutUs';
import Contact from '@/pages/static/Contact';
import FAQs from '@/pages/static/FAQs';
import PrivacyPolicy from '@/pages/static/PrivacyPolicy';
import TermsOfService from '@/pages/static/TermsOfService';
import Support from '@/pages/static/Support';

// Wrapper component to extract route params and pass them to EditInstructor
const EditInstructorWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <EditInstructor instructorId={id || ''} />;
};

const App = () => {
  const routes = [
    // Public routes - no authentication required
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/instructors',
      element: <InstructorsPage />,
    },
    {
      path: '/instructors/:id',
      element: <InstructorProfilePage />,
    },
    {
      path: '/join-instructor',
      element: <JoinInstructorPage />,
    },
    {
      path: '/admin/login',
      element: <AdminLogin />,
    },
    
    // Static pages
    {
      path: '/about',
      element: <AboutUs />,
    },
    {
      path: '/contact',
      element: <Contact />,
    },
    {
      path: '/faqs',
      element: <FAQs />,
    },
    {
      path: '/privacy',
      element: <PrivacyPolicy />,
    },
    {
      path: '/terms',
      element: <TermsOfService />,
    },
    {
      path: '/support',
      element: <Support />,
    },
    
    // Admin routes - protected
    {
      path: '/admin',
      element: (
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: <AdminDashboard />,
        },
        {
          path: 'instructors',
          element: <AdminInstructors />,
        },
        {
          path: 'edit-instructor/:id',
          element: <EditInstructorWrapper />,
        }
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    }
  ];

  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
};

export default App;
