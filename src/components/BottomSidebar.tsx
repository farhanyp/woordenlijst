'use client';

import { memo } from 'react';

interface BottomSidebarProps {
  className?: string;
}

const BottomSidebar: React.FC<BottomSidebarProps> = memo(({ className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${className}`}>
      {/* Leidraad Button */}
      <button className="bg-[#2B4A5A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2B4A5A]/90 transition-colors duration-200 min-w-[200px]">
        Leidraad
      </button>

      {/* Technische handleiding Button */}
      <button className="bg-[#2B4A5A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2B4A5A]/90 transition-colors duration-200 min-w-[200px]">
        Technische handleiding
      </button>
    </div>
  );
});

BottomSidebar.displayName = 'BottomSidebar';

export default BottomSidebar;