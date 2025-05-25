'use client';

import type { NextPage } from 'next';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MainContent from '@/components/MainContent';
import BottomSidebar from '@/components/BottomSidebar';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar dengan Hero Section terintegrasi */}
      <Navbar 
        showHero={true}
        heroTitle="Welkom bij Woordenlijst"
        heroSubtitle="Spellingregels en taaladvies voor het Nederlands"
        scrollThreshold={1}
      />

      {/* Layout dengan Sidebar dan Main Content */}
      <MainContent
        leftSidebar={<LeftSidebar />}
        rightSidebar={<RightSidebar />}
      />
    </div>
  );
};

export default HomePage;