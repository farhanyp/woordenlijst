'use client';

import { memo } from 'react';
import type { BaseComponentProps, StatisticsData } from '@/types';
import { STATISTICS_DATA } from '@/constants';

interface RightSidebarProps extends BaseComponentProps {}

// Custom rounded card component
const CustomCard = memo<{
  children: React.ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
}>(({ children, variant = 'default', className = '' }) => {
  const baseClasses = "rounded-tr-[75px] rounded-tl-[75px] rounded-br-[75px] transition-all duration-200";
  const variantClasses = variant === 'gradient' 
    ? "bg-gradient-to-br from-accent-500 to-info-500 text-white hover:from-accent-500/90 hover:to-info-500/90 border-[0.8px] border-text-primary p-[16px]" 
    : "bg-white border-[0.8px] border-text-primary hover:border-text-primary p-[16px]";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <div>{children}</div>
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
        <div className={`${sizeClasses[valueSize]} font-semibold mb-4 text-button-primary`}>
          {value}
        </div>
        <div className="text-xs font-light text-button-primary">
          {label}
        </div>
      </div>
    </CustomCard>
  );
});

StatCard.displayName = 'StatCard';

const RightSidebar: React.FC<RightSidebarProps> = memo(({ className = '' }) => {
  const lastUpdateData = {
    value: '20 februari 2025',
    label: 'Laatste update',
    valueSize: 'medium' as const
  };

  return (
    <div className={`w-full px-2.5 space-y-4 ${className}`}>
      {/* Statistics Cards Container */}
      <div className="space-y-4">
        {STATISTICS_DATA.map((stat) => (
          <StatCard
            key={stat.id}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>

      {/* Last Update Card */}
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