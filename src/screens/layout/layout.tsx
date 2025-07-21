import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-home-background flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;