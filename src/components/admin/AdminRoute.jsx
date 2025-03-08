import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has admin rights
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');
      
      if (!token || userName !== 'admin') {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mb-4" />
        <h2 className="text-lg font-medium text-gray-900">Verifying Admin Access</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we verify your credentials...</p>
      </div>
    );
  }

  // If not authenticated as admin, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated as admin, render the children
  return children;
};

export default AdminRoute;