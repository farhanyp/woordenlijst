'use client';

import { useEffect, useState, memo } from 'react';
import type { FloatingChar } from '@/types';
import { FLOATING_CHARS, ANIMATION_PATHS, ANIMATION_DIRECTIONS, FONT_WEIGHTS } from '@/constants';

interface FloatingCharactersProps {
  isScrolled?: boolean;
  charCount?: number;
}

const FloatingCharacters: React.FC<FloatingCharactersProps> = memo(({ 
  isScrolled = false, 
  charCount = 200 
}) => {
  const [characters, setCharacters] = useState<FloatingChar[]>([]);

  useEffect(() => {
    const generateCharacters = (): FloatingChar[] => {
      return Array.from({ length: charCount }, (_, i) => ({
        id: i,
        char: FLOATING_CHARS[Math.floor(Math.random() * FLOATING_CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 30 + 8,
        delay: Math.random() * 15,
        direction: ANIMATION_DIRECTIONS[Math.floor(Math.random() * ANIMATION_DIRECTIONS.length)],
        path: ANIMATION_PATHS[Math.floor(Math.random() * ANIMATION_PATHS.length)],
        fontWeight: FONT_WEIGHTS[Math.floor(Math.random() * FONT_WEIGHTS.length)]
      }));
    };

    setCharacters(generateCharacters());
  }, [charCount]);

  if (characters.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {characters.map((char) => (
        <FloatingCharacter 
          key={char.id} 
          char={char} 
          isScrolled={isScrolled} 
        />
      ))}
    </div>
  );
});

// Individual floating character component
const FloatingCharacter = memo<{
  char: FloatingChar;
  isScrolled: boolean;
}>(({ char, isScrolled }) => (
  <div
    className={`
      absolute select-none animate-${char.path} transition-all duration-500 ease-out
      ${char.fontWeight} ${isScrolled ? 'scale-75' : 'scale-100'}
    `}
    style={{
      left: `${char.x}%`,
      top: `${char.y}%`,
      fontSize: `${char.size}px`,
      color: 'rgb(58, 95, 119)', // floating color from tailwind config
      animationDuration: `${char.duration}s`,
      animationDelay: `${char.delay}s`,
      animationDirection: char.direction,
      transform: `translate(-50%, -50%) ${isScrolled ? 'scale(0.75)' : 'scale(1)'}`,
    }}
  >
    {char.char}
  </div>
));

FloatingCharacter.displayName = 'FloatingCharacter';
FloatingCharacters.displayName = 'FloatingCharacters';

export default FloatingCharacters;