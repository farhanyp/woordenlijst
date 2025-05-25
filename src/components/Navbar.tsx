'use client';

import { 
  useState, 
  useEffect, 
  useCallback, 
  createContext, 
  useContext,
  memo
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import type { NavbarContextType, ExtendedNavbarProps } from '@/types';
import { DEFAULT_MENU_ITEMS } from '@/constants';
import FloatingCharacters from './FloatingCharacters';

// Context
const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

// Custom hook
const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

// Typing Placeholder Component
const TypingPlaceholder = memo(() => {
  const [text] = useTypewriter({
    words: [
      "'?' voor één onbekend tekens",
      "'*' voor meer onbekende tekens"
    ],
    loop: true,
    delaySpeed: 300,
    deleteSpeed: 50,
    typeSpeed: 70,
  });

  return (
    <span className="text-text-muted text-base font-thin">
      Gebruik joker {text}
      <Cursor cursorStyle="|" cursorColor="#9CA3AF" />
    </span>
  );
});

TypingPlaceholder.displayName = 'TypingPlaceholder';

// Main Navbar Component
const Navbar: React.FC<ExtendedNavbarProps> = ({ 
  className = '',
  logoSrc = '/logo.svg',
  logoAlt = 'Woordenlijst Logo',
  menuItems = DEFAULT_MENU_ITEMS,
  scrollThreshold = 1,
  hysteresisOffset = 15,
  showHero = false,
  heroTitle = 'Zoek een woord',
  heroSubtitle = 'Spellingregels en taaladvies voor het Nederlands'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Scroll detection with hysteresis
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > scrollThreshold;
      
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled, scrollThreshold]);

  // Menu handlers
  const toggleMenu = useCallback((): void => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, closeMenu]);

  // Context value
  const contextValue: NavbarContextType = {
    isMenuOpen,
    isScrolled,
    toggleMenu,
    closeMenu,
    menuItems
  };

  return (
    <NavbarContext.Provider value={contextValue}>
      {/* Combined Sticky Container */}
      <div className="sticky top-0 z-50 w-full">
        {/* Navigation Bar */}
        <NavigationBar className={className} logoSrc={logoSrc} logoAlt={logoAlt} />

        {/* Hero Section (Optional) */}
        {showHero && (
          <HeroSection 
            title={heroTitle}
            subtitle={heroSubtitle}
            isScrolled={isScrolled}
          />
        )}
      </div>
    </NavbarContext.Provider>
  );
};

// Navigation Bar Component
const NavigationBar = memo<{
  className: string;
  logoSrc: string;
  logoAlt: string;
}>(({ className, logoSrc, logoAlt }) => {
  const { isScrolled } = useNavbar();

  return (
    <nav className={`w-full bg-white/95 transition-all duration-1000 ease-out ${className}`}>
      <div 
        className={`
          px-3 py-4 flex items-center justify-between transition-all duration-1000 ease-out
          ${isScrolled ? 'h-[66px]' : 'h-28'}
        `}
      >
        <LogoSection logoSrc={logoSrc} logoAlt={logoAlt} />
        <DesktopMenu />
        <MobileMenuButton />
      </div>

      <MobileMenu />
      <MobileOverlay />
    </nav>
  );
});

NavigationBar.displayName = 'NavigationBar';

// Hero Section Component - Fixed to always show search bar
const HeroSection = memo<{
  title: string;
  subtitle: string;
  isScrolled: boolean;
}>(({ title, subtitle, isScrolled }) => {
  return (
    <section 
      className={`
        mx-3 bg-hero-bg text-white 
        flex items-center justify-center transition-all duration-500 ease-out
        relative overflow-hidden
        ${isScrolled ? 'h-[132px]' : 'h-[230px]'}
      `}
    >
      {/* Floating Characters Background */}
      <FloatingCharacters 
        isScrolled={isScrolled} 
        charCount={isScrolled ? 30 : 200}
      />
      
      <div className="container flex justify-center mx-auto w-full relative z-10">
        <SearchContainer isScrolled={isScrolled} title={title} />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Search Container Component
const SearchContainer = memo<{
  isScrolled: boolean;
  title: string;
}>(({ isScrolled, title }) => {
  return (
    <div className={`
      bg-hero-overlay transition-all duration-500 ease-out
      ${isScrolled ? 'p-10' : 'p-[2.60rem]'}
    `}>
      <div className={`
        transition-all duration-500 ease-out
        ${isScrolled ? 'px-2' : 'px-3'}
      `}>
        {/* Title - Only show when not scrolled */}
        <SearchTitle isScrolled={isScrolled} title={title} />
        
        {/* Search Form - Always visible */}
        <SearchForm isScrolled={isScrolled} />
      </div>
    </div>
  );
});

SearchContainer.displayName = 'SearchContainer';

// Search Title Component
const SearchTitle = memo<{
  isScrolled: boolean;
  title: string;
}>(({ isScrolled, title }) => {
  if (isScrolled) return null;
  
  return (
    <h2 className="text-white font-medium text-[32px] leading-[38px] mb-2 transition-all duration-500 ease-out">
      {title}
    </h2>
  );
});

SearchTitle.displayName = 'SearchTitle';

// Search Form Component
const SearchForm = memo<{
  isScrolled: boolean;
}>(({ isScrolled }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Here you would implement actual search logic
      console.log('Searching for:', searchValue.trim());
    }
  }, [searchValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <form onSubmit={handleSearch} className="w-full">
      <SearchInputContainer 
        isScrolled={isScrolled}
        searchValue={searchValue}
        isFocused={isFocused}
        onInputChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </form>
  );
});

SearchForm.displayName = 'SearchForm';

// Search Input Container Component
const SearchInputContainer = memo<{
  isScrolled: boolean;
  searchValue: string;
  isFocused: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}>(({ isScrolled, searchValue, isFocused, onInputChange, onFocus, onBlur }) => {
  return (
    <div className={`
       flex items-center bg-white rounded-xl transition-all duration-500 ease-out
      ${isScrolled ? 'pl-2 mb-0' : 'pl-[10px] mb-4'}
    `}>
      {/* Search Icon */}
      <SearchIcon isScrolled={isScrolled} />
      
      {/* Input Field Container */}
      <div className="relative flex-1">
        <SearchInput 
          isScrolled={isScrolled}
          searchValue={searchValue}
          isFocused={isFocused}
          onInputChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        
        {/* Placeholder Components */}
        <SearchPlaceholder 
          searchValue={searchValue}
          isFocused={isFocused}
          isScrolled={isScrolled}
        />
      </div>
      
      {/* Submit Button */}
      <SearchButton isScrolled={isScrolled} hasValue={!!searchValue} />
    </div>
  );
});

SearchInputContainer.displayName = 'SearchInputContainer';

// Search Icon Component
const SearchIcon = memo<{ isScrolled: boolean }>(({ isScrolled }) => (
  <Search 
    size={isScrolled ? 16 : 20} 
    className="text-black font-thin transition-all duration-300 flex-shrink-0" 
  />
));

SearchIcon.displayName = 'SearchIcon';

// Search Input Component
const SearchInput = memo<{
  isScrolled: boolean;
  searchValue: string;
  isFocused: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}>(({ isScrolled, searchValue, isFocused, onInputChange, onFocus, onBlur }) => (
  <input
    type="text"
    value={searchValue}
    onChange={onInputChange}
    onFocus={onFocus}
    onBlur={onBlur}
    className={`
      bg-transparent border-none rounded-xl font-thin
      text-gray-800 focus:outline-none relative z-10 transition-all duration-500 ease-out
      ${isScrolled 
        ? 'w-[280px] px-2 py-1 text-sm' 
        : 'w-[600px] px-3 py-[6px] text-base'
      }
    `}
    aria-label="Zoek een woord"
  />
));

SearchInput.displayName = 'SearchInput';

// Search Placeholder Component
const SearchPlaceholder = memo<{
  searchValue: string;
  isFocused: boolean;
  isScrolled: boolean;
}>(({ searchValue, isFocused, isScrolled }) => {
  if (searchValue || isFocused) return null;

  if (isScrolled) {
    return (
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
        <span className="text-text-muted text-sm font-thin">
          Zoek een woord...
        </span>
      </div>
    );
  }

  return (
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
      <TypingPlaceholder />
    </div>
  );
});

SearchPlaceholder.displayName = 'SearchPlaceholder';

// Search Button Component
const SearchButton = memo<{
  isScrolled: boolean;
  hasValue: boolean;
}>(({ isScrolled, hasValue }) => (
  <button
    type="submit"
    disabled={!hasValue}
    className={`
      text-black font-thin rounded-lg transition-all duration-500 ease-out flex-shrink-0
      focus:outline-none focus:ring-2 focus:ring-white/30
      ${isScrolled ? 'py-1 px-2' : 'py-[6px] px-3'}
      ${hasValue ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}
    `}
    aria-label="Zoeken"
  >
    <ArrowRight size={isScrolled ? 16 : 20} />
  </button>
));

SearchButton.displayName = 'SearchButton';

// Logo Section Component
const LogoSection = memo<{ logoSrc: string; logoAlt: string }>(({ logoSrc, logoAlt }) => {
  const { isScrolled } = useNavbar();
  
  return (
    <Link href="/" className="flex-shrink-0">
      <Image 
        src={logoSrc} 
        alt={logoAlt} 
        width={500} 
        height={50}
        className={`
          w-auto transition-all duration-1000 ease-out
          ${isScrolled ? 'h-10' : 'h-[70px]'}
        `}
        priority
      />
    </Link>
  );
});

LogoSection.displayName = 'LogoSection';

// Desktop Menu Component
const DesktopMenu = memo(() => {
  const { menuItems } = useNavbar();
  
  return (
    <div className="hidden md:flex">
      <div className="flex space-x-1">
        {menuItems.map((item) => (
          <DesktopMenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
});

DesktopMenu.displayName = 'DesktopMenu';

// Desktop Menu Item Component
const DesktopMenuItem = memo<{ 
  item: { id: string; href: string; label: string } 
}>(({ item }) => (
  <Link 
    href={item.href} 
    className="p-2 text-accent-500 text-[1.3rem] leading-8 font-medium cursor-pointer hover:text-accent-500/80 transition-colors duration-200 rounded-lg hover:bg-accent-50"
  >
    {item.label}
  </Link>
));

DesktopMenuItem.displayName = 'DesktopMenuItem';

// Mobile Menu Button Component
const MobileMenuButton = memo(() => {
  const { isMenuOpen, toggleMenu } = useNavbar();
  
  return (
    <button
      onClick={toggleMenu}
      className="md:hidden p-2 rounded-lg text-accent-500 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
      type="button"
    >
      <div className="relative w-6 h-6">
        <Menu 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-300
            ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}
          `} 
        />
        <X 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-300
            ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}
          `} 
        />
      </div>
    </button>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';

// Mobile Menu Component
const MobileMenu = memo(() => {
  const { isMenuOpen, menuItems, closeMenu } = useNavbar();
  
  return (
    <div 
      className={`
        md:hidden transition-all duration-300 ease-in-out overflow-hidden
        bg-white/95 backdrop-blur-sm border-t border-gray-100
        ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className="px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <MobileMenuItem key={item.id} item={item} onClose={closeMenu} />
        ))}
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Mobile Menu Item Component
const MobileMenuItem = memo<{
  item: { id: string; href: string; label: string; icon?: any };
  onClose: () => void;
}>(({ item, onClose }) => (
  <Link 
    href={item.href}
    onClick={onClose}
    className="flex items-center px-4 py-3 text-accent-500 rounded-lg hover:bg-accent-500/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
  >
    {item.icon && <item.icon size={20} className="mr-3" />}
    {item.label}
  </Link>
));

MobileMenuItem.displayName = 'MobileMenuItem';

// Mobile Overlay Component
const MobileOverlay = memo(() => {
  const { isMenuOpen, closeMenu } = useNavbar();
  
  if (!isMenuOpen) return null;
  
  return (
    <div 
      className="md:hidden fixed inset-0 bg-black/25 backdrop-blur-sm z-40 transition-opacity duration-300"
      onClick={closeMenu}
      onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
      role="button"
      tabIndex={0}
      aria-label="Close menu"
    />
  );
});

MobileOverlay.displayName = 'MobileOverlay';

export default Navbar;
export { useNavbar };