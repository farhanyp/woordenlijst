import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  href: string;
  label: string;
  icon?: LucideIcon;
}

export interface NavbarContextType {
  isMenuOpen: boolean;
  isScrolled: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  menuItems: MenuItem[];
}

export interface NavbarProps {
  className?: string;
  logoSrc?: string;
  logoAlt?: string;
  menuItems?: MenuItem[];
  scrollThreshold: number;
  hysteresisOffset?: number;
}

export interface ExtendedNavbarProps extends NavbarProps {
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface StatisticsData {
  id: string;
  value: string;
  label: string;
}

export interface SearchExample {
  search: string;
  result: string;
}

export interface FloatingChar {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: 'normal' | 'reverse' | 'alternate';
  path: 'float' | 'spiral' | 'wave' | 'bounce';
  fontWeight: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}