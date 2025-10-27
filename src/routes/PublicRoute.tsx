import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getBearerToken } from '../utils/localStorage';
import { ROUTES } from '../utils/constants';

const PublicRoute: React.FC = () => {
  const token = getBearerToken();

  if (token) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default PublicRoute; 
