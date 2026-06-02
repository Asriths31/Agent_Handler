import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import RegisterPage from '../pages/Register/RegisterPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import AgentsPage from '../pages/Agents/AgentsPage.jsx';
import UploadPage from '../pages/Upload/UploadPage.jsx';
import TasksPage from '../pages/Tasks/TasksPage.jsx';

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
