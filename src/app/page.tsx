'use client';

import type { NextPage } from 'next';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        showHero={true}
        heroTitle="Zoek een woord"
        heroSubtitle="Spellingregels en taaladvies voor het Nederlands"
        scrollThreshold={1}
      />

      <MainContent
        leftSidebar={<LeftSidebar />}
        rightSidebar={<RightSidebar />}
      />

      <Footer/>
    </div>
  );
};

export default HomePage;