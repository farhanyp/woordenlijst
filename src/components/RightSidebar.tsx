'use client';

import { memo } from 'react';

interface RightSidebarProps {
  className?: string;
}

// Custom rounded card component
const CustomCard = memo<{
  children: React.ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
}>(({ children, variant = 'default', className = '' }) => {
  const baseClasses = "rounded-tr-[75px] rounded-tl-[75px] rounded-br-[75px] transition-all duration-200";
  const variantClasses = variant === 'gradient' 
    ? "bg-gradient-to-br from-[#2B7A78] to-[#17A2B8] text-white hover:from-[#2B7A78]/90 hover:to-[#17A2B8]/90 border-[0.8px] border-[rgb(33,37,41)] p-[16px]" 
    : "bg-white border-[0.8px] border-[rgb(33,37,41)] hover:border-[rgb(33,37,41)] p-[16px]";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <div>
        {children}
      </div>
    </div>
  );
});

CustomCard.displayName = 'CustomCard';

// Statistics card component
const StatCard = memo<{
  value: string;
  label: string;
  valueSize?: 'small' | 'medium' | 'large';
}>(({ value, label, valueSize = 'large' }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-[29px]'
  };

  return (
    <CustomCard>
      <div className="text-center py-12">
        <div 
          className={`${sizeClasses[valueSize]} font-semibold mb-4`}
          style={{ color: 'rgb(24, 43, 73)' }}
        >
          {value}
        </div>
        <div 
          className="text-xs font-light"
          style={{ color: 'rgb(24, 43, 73)' }}
        >
          {label}
        </div>
      </div>
    </CustomCard>
  );
});

StatCard.displayName = 'StatCard';

const RightSidebar: React.FC<RightSidebarProps> = memo(({ className = '' }) => {
  // Data configuration untuk mudah maintenance
  const statisticsData = [
    {
      id: 'trefwoorden',
      value: '229.862',
      label: 'AANTAL TREFWOORDEN'
    },
    {
      id: 'woordvormen', 
      value: '848.203',
      label: 'AANTAL TREFWOORDEN'
    }
  ];

  const lastUpdateData = {
    value: '20 februari 2025',
    label: 'Laatste update',
    valueSize: 'medium' as const
  };

  return (
    <div className={`w-full px-2.5 space-y-4 ${className}`}>
      {/* Statistics Cards Container */}
      <div className="space-y-4">
        {statisticsData.map((stat) => (
          <StatCard
            key={stat.id}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>

      {/* Laatste Update Card */}
      <StatCard
        value={lastUpdateData.value}
        label={lastUpdateData.label}
        valueSize={lastUpdateData.valueSize}
      />
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

export default RightSidebar;