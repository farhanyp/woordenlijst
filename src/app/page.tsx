'use client';

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

const HomePage: NextPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupText, setPopupText] = useState('');

  // Fetch text dari file
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch('/text.txt');
        const text = await response.text();
        setPopupText(text);
      } catch (error) {
        console.error('Error loading text file:', error);
        setPopupText('Maaf, konten tidak dapat dimuat.');
      }
    };

    fetchText();
  }, []);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        showHero={true}
        heroTitle="Zoek een woord"
        heroSubtitle="Spellingregels en taaladvies voor het Nederlands"
        scrollThreshold={1}
      />

      <MainContent
        leftSidebar={<LeftSidebar onOpenPopup={openPopup} />}
        rightSidebar={<RightSidebar />}
      />

      <Footer/>

      {/* Pop-up Modal - Rendered at page level */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ 
            zIndex: 99999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-auto p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
            
            {/* Content */}
            <div className="pr-8">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">
                Spelling Informatie
              </h4>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {popupText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;