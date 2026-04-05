import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      {/* 
        The Header has h-[50px] and sticky positioning.
        Using pt-[50px] or just standard margin isn't strictly necessary if Header is sticky, 
        but we must ensure content isn't hidden under it if it's position: fixed. 
        Header has "sticky top-0", so normal flow handles the spacing automatically.
      */}
      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
