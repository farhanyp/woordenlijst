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
  size: number;
  lastModified: string;
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
    size?: number;
    lastModified?: string;
  }>({
    url: '',
    filename: '',
    exists: false
  });

  // Fetch text from local uploads directory
  useEffect(() => {
    const fetchText = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/fetch-text');
        
        if (!response.ok) {
          if (response.status === 404) {
            setPopupText('No file has been uploaded yet. Please upload a file first through the upload page.');
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
          exists: true,
          size: data.size,
          lastModified: data.lastModified
        });
      } catch (error) {
        console.error('Error loading text file:', error);
        setPopupText('Sorry, content cannot be loaded. Please try again later.');
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
          exists: true,
          size: data.size,
          lastModified: data.lastModified
        });
      } else {
        // If file doesn't exist after refresh
        setPopupText('No file has been uploaded yet.');
        setFileInfo(prev => ({ ...prev, exists: false }));
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

      {/* Pop-up Modal - Mobile Responsive */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[99999]"
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-4 sm:p-6 relative shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 z-10"
            >
              ×
            </button>
            
            {/* Content */}
            <div className="pr-8 sm:pr-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h4 className="text-xl font-semibold text-gray-800">
                  Spelling Information
                </h4>
                <div className="flex flex-wrap gap-2">
                  {fileInfo.exists && fileInfo.url && (
                    <a 
                      href={fileInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View Original File
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
                  <span className="ml-3 text-gray-600">Loading from server...</span>
                </div>
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {popupText}
                </div>
              )}

              {/* File Info */}
              {fileInfo.exists && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>File: {fileInfo.filename}.txt</p>
                    {fileInfo.size && (
                      <p>Size: {(fileInfo.size / 1024).toFixed(1)} KB</p>
                    )}
                    {fileInfo.lastModified && (
                      <p>Last modified: {new Date(fileInfo.lastModified).toLocaleString('en-US')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Link */}
              {!fileInfo.exists && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a 
                    href="/upload"
                    className="text-button-primary hover:text-button-secondary font-medium"
                  >
                    → Go to upload page
                  </a>
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