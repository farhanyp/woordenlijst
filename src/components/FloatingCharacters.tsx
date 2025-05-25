'use client';

import { useEffect, useState, memo } from 'react';

interface FloatingChar {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: 'normal' | 'reverse' | 'alternate';
  path: 'float' | 'spiral' | 'wave' | 'bounce';
  fontWeight: 'font-thin' | 'font-extralight' | 'font-light' | 'font-medium' | 'font-semibold' | 'font-black'; 
}

const FloatingCharacters: React.FC<{
  isScrolled?: boolean;
  charCount?: number;
}> = memo(({ isScrolled = false, charCount = 200 }) => { // Default meningkat ke 500
  const [characters, setCharacters] = useState<FloatingChar[]>([]);

  // Hanya huruf A-Z dan a-z, tanpa angka dan special character
  const CHARS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];

  const PATHS = ['float', 'spiral', 'wave', 'bounce'] as const;
  const DIRECTIONS = ['normal', 'reverse', 'alternate'] as const;
  const FONT_WEIGHTS = ['font-thin', 'font-extralight', 'font-light', 'font-medium', 'font-semibold', 'font-black'] as const;

  useEffect(() => {
    const generateCharacters = () => {
      const newChars: FloatingChar[] = [];
      
      for (let i = 0; i < charCount; i++) {
        newChars.push({
          id: i,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 30 + 8, // Durasi lebih bervariasi (8-38s)
          delay: Math.random() * 15, // Delay lebih bervariasi (0-15s)
          direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
          path: PATHS[Math.floor(Math.random() * PATHS.length)],
          fontWeight: FONT_WEIGHTS[Math.floor(Math.random() * FONT_WEIGHTS.length)]
        });
      }
      
      setCharacters(newChars);
    };

    generateCharacters();
  }, [charCount]);

  if (characters.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {characters.map((char) => (
        <div
          key={char.id}
          className={`
            absolute select-none
            animate-${char.path} transition-all duration-500 ease-out
            ${char.fontWeight}
            ${isScrolled ? 'scale-75' : 'scale-100'}
          `}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            fontSize: `${char.size}px`,
            color: '#3a5f77',
            animationDuration: `${char.duration}s`,
            animationDelay: `${char.delay}s`,
            animationDirection: char.direction,
            transform: `translate(-50%, -50%) ${isScrolled ? 'scale(0.75)' : 'scale(1)'}`,
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
});

FloatingCharacters.displayName = 'FloatingCharacters';

export default FloatingCharacters;