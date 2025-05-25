// components/Footer.tsx
'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = memo(({ className = '' }) => {
  return (
    <footer className={`w-full bg-[#005983] py-2 px-3 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <div className="space-y-2">
              {/* Logo Atas */}
              <div className="w-[247px] h-[55px]">
                <Image
                  src="/footer-up.png" // Sesuaikan dengan path logo Anda
                  alt="Taalunie Logo Top"
                  width={247}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Logo Bawah */}
              <div className="w-[247px] h-[89px]">
                <Image
                  src="/footer-down.png" // Sesuaikan dengan path logo Anda
                  alt="Taalunie Logo Bottom"
                  width={247}
                  height={89}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 text-white text-[16px] leading-6">
            {/* Copyright Text with Email */}
            <div className="leading-relaxed">
              <p className="">
                © 2025 Nederlandse Taalunie, alle rechten voorbehouden
              </p>
              <p>
                Suggesties of vragen? Stuur een e-mail naar{' '}
                <Link 
                  href="mailto:info@taalunie.org"
                  className="text-[#88d6df] font-semibold hover:text-[#a0e4ed] transition-colors duration-200"
                >
                  info@taalunie.org
                </Link>
              </p>
            </div>

            {/* Website Links */}
            <div className="flex flex-wrap items-center gap-2">
              <span>Meer weten over taal? Kijk op</span>
              <Link 
                href="https://www.taalunie.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#88d6df] font-semibold hover:text-[#a0e4ed] transition-colors duration-200"
              >
                www.taalunie.org
              </Link>
              <span>of</span>
              <Link 
                href="https://www.taaladvies.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#88d6df] font-semibold hover:text-[#a0e4ed] transition-colors duration-200"
              >
                www.taaladvies.net
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;