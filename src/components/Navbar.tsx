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
import type { MenuItem, NavbarContextType, NavbarProps } from '@/types';
import FloatingCharacters from './FloatingCharacters';

// Default menu items
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'spellingregels', href: '/spellingregels', label: 'Spellingregels' },
  { id: 'taaladvies', href: '/taaladvies', label: 'Taaladvies' }
];

// Extended props interface to include hero content
interface ExtendedNavbarProps extends NavbarProps {
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
}

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
    delaySpeed: 300, // Delay sebelum mulai menghapus
    deleteSpeed: 50,  // Kecepatan menghapus (backspace effect)
    typeSpeed: 70,    // Kecepatan mengetik
  });

  return (
    <span className="text-gray-500 text-base font-thin">
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
  scrollThreshold,
  hysteresisOffset = 15,
  showHero = false,
  heroTitle = 'Welkom bij Woordenlijst',
  heroSubtitle = 'Spellingregels en taaladvies voor het Nederlands'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Fixed scroll detection dengan hysteresis
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 0;
      
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

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
      {/* Debug indicator - Improved */}
      <div className="fixed top-0 right-0 bg-black/80 text-white text-xs z-[100] pointer-events-none rounded-bl-lg">
        <div className="space-y-1">
          <div>Y: {Math.round(window?.scrollY || 0)}px</div>
          <div>Scrolled: <span className={isScrolled ? 'text-green-400' : 'text-red-400'}>{isScrolled ? 'Yes' : 'No'}</span></div>
          <div className="text-gray-300">
            Zone: {scrollThreshold - hysteresisOffset}-{scrollThreshold + hysteresisOffset}px
          </div>
        </div>
      </div>
      
      {/* Combined Sticky Container */}
      <div className="sticky top-0 z-50 w-full">
        {/* Navigation Bar */}
        <nav 
          className={`
            w-full bg-white/95
            transition-all duration-1000 ease-out
            ${className}
          `}
        >
          <div 
            className={`
              px-3 my-4 flex items-center justify-between transition-all duration-1000 ease-out
              ${isScrolled ? 'h-16' : 'h-20'}
            `}
          >
            <LogoSection logoSrc={logoSrc} logoAlt={logoAlt} />
            <DesktopMenu />
            <MobileMenuButton />
          </div>

          <MobileMenu />
          <MobileOverlay />
        </nav>

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

// Hero Section Component - Improved transitions
const HeroSection = memo<{
  title: string;
  subtitle: string;
  isScrolled: boolean;
}>(({ title, subtitle, isScrolled }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  return (
    <section 
      className={`
        bg-[#88d6df] m-3 text-white 
        flex items-center justify-center transition-all duration-500 ease-out
        relative overflow-hidden
        ${isScrolled ? 'h-24' : 'h-[230px]'}
      `}
    >
      {/* Floating Characters Background */}
      <FloatingCharacters 
        isScrolled={isScrolled} 
        charCount={isScrolled ? 50 : 200}
      />
      
      <div className="container flex justify-center mx-auto w-full relative z-10">
        <div className="transition-all duration-500 ease-out">
          {/* Search Box - Only show when not scrolled */}
          {!isScrolled && (
            <div className="bg-[#005983] p-7">
              <div className="transition-all duration-500 ease-out px-3">
                <h2 className="text-white font-medium text-[32px] leading-[38px] mb-2">
                  Zoek een woord
                </h2>
                
                <form onSubmit={handleSearch} className="">
                  <div className="flex items-center bg-white rounded-xl pl-[10px] mb-4 relative">
                    {/* Search Icon */}
                    <Search size={20} className="text-black font-thin" />
                    
                    {/* Input Field dengan Typing Placeholder */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="
                          w-[430px] px-3 py-[6px] 
                          bg-transparent
                          border-none rounded-xl font-thin
                          text-gray-800
                          focus:outline-none
                          relative z-10
                        "
                      />
                      
                      {/* Custom Animated Placeholder */}
                      {!searchValue && !isFocused && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
                          <TypingPlaceholder />
                        </div>
                      )}
                    </div>
                    
                    {/* Submit Button with Arrow Right Icon */}
                    <button
                      type="submit"
                      className="
                        py-[6px] px-3 text-black font-thin rounded-lg
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-white/30
                      "
                      aria-label="Zoeken"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Logo Section Component - Improved transitions
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
      <div className="flex">
        {menuItems.map((item) => (
          <Link 
            key={item.id}
            href={item.href} 
            className="p-2 text-[#2B7A78] text-[1.3rem] leading-[1.75rem] font-medium cursor-pointer hover:text-[#2B7A78]/80 transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
});

DesktopMenu.displayName = 'DesktopMenu';

// Mobile Menu Button Component
const MobileMenuButton = memo(() => {
  const { isMenuOpen, toggleMenu } = useNavbar();
  
  return (
    <button
      onClick={toggleMenu}
      className="
        md:hidden p-2 rounded-lg text-[#2B7A78] 
        hover:bg-gray-100 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/20
      "
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
      type="button"
    >
      <div className="relative w-6 h-6">
        <Menu 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-1000
            ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}
          `} 
        />
        <X 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-1000
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
        md:hidden transition-all duration-1000 ease-in-out overflow-hidden
        bg-white/95 backdrop-blur-sm border-t border-gray-100
        ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className="px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.id}
            href={item.href}
            onClick={closeMenu}
            className="
              flex items-center px-4 py-3 text-[#2B7A78] rounded-lg
              hover:bg-[#2B7A78]/10 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/20
            "
          >
            {item.icon && <item.icon size={20} className="mr-3" />}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Mobile Overlay Component
const MobileOverlay = memo(() => {
  const { isMenuOpen, closeMenu } = useNavbar();
  
  if (!isMenuOpen) return null;
  
  return (
    <div 
      className="
        md:hidden fixed inset-0 bg-black/25 backdrop-blur-sm z-40
        animate-in fade-in duration-1000
      "
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