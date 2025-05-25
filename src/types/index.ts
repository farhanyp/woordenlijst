import { LucideIcon } from 'lucide-react';

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
  hysteresisOffset?: number
}