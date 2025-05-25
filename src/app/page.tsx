'use client';

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';

interface TextResponse {
  content: string;
  url: string;
  publicId: string;
  filename: string;
}

interface TextError {
  error: string;
}

const HomePage: NextPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    url: string;
    filename: string;
    exists: boolean;
  }>({
    url: '',
    filename: '',
    exists: false
  });

  // Fetch text dari Cloudinary menggunakan static filename
  useEffect(() => {
    const fetchText = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/fetch-text');
        
        if (!response.ok) {
          if (response.status === 404) {
            setPopupText('Belum ada file yang diupload. Silakan upload file terlebih dahulu melalui halaman upload.');
            setFileInfo(prev => ({ ...prev, exists: false }));
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TextResponse | TextError = await response.json();

        if ('error' in data) {
          throw new Error(data.error);
        }

        setPopupText(data.content);
        setFileInfo({
          url: data.url,
          filename: data.filename,
          exists: true
        });
      } catch (error) {
        console.error('Error loading text file from Cloudinary:', error);
        setPopupText('Maaf, konten tidak dapat dimuat dari Cloudinary. Silakan coba lagi nanti.');
        setFileInfo(prev => ({ ...prev, exists: false }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchText();
  }, []);

  // Function to refresh content (useful after upload)
  const refreshContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fetch-text');
      
      if (response.ok) {
        const data: TextResponse = await response.json();
        setPopupText(data.content);
        setFileInfo({
          url: data.url,
          filename: data.filename,
          exists: true
        });
      }
    } catch (error) {
      console.error('Error refreshing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Pop-up Modal */}
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  Spelling Informatie
                </h4>
                <div className="flex gap-2">
                  {fileInfo.exists && fileInfo.url && (
                    <a 
                      href={fileInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Lihat File Asli
                    </a>
                  )}
                  <button
                    onClick={refreshContent}
                    disabled={isLoading}
                    className="text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading dari Cloudinary...</span>
                </div>
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {popupText}
                </div>
              )}

              {/* File Info */}
              {fileInfo.exists && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    File: {fileInfo.filename}.txt
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;