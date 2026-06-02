import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import AgentsPage from '../pages/AgentsPage.jsx';
import UploadPage from '../pages/UploadPage.jsx';
import TasksPage from '../pages/TasksPage.jsx';

export const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export const appRoutes = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      }
    ]
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />
          },
          {
            path: '/agents',
            element: <AgentsPage />
          },
          {
            path: '/upload',
            element: <UploadPage />
          },
          {
            path: '/tasks',
            element: <TasksPage />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];
