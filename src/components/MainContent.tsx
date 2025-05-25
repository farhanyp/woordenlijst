// MainContent.tsx
'use client';

import React from 'react';

interface MainContentProps {
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  leftSidebar,
  rightSidebar,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="w-full py-8">
        {/* Layout Sidebar */}
        <div className="flex flex-col lg:flex-row justify-between lg:px-3 items-start lg:mx-[100px]">
          {leftSidebar && (
            <aside className="w-full lg:w-auto lg:p-[10px]">
              <div className="sticky top-24">
                {leftSidebar}
              </div>
            </aside>
          )}

          {rightSidebar && (
            <aside className="w-full lg:w-auto lg:max-w-[40%] mt-8 lg:mt-0">
              <div className="sticky top-24 lg:ml-4">
                {rightSidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;