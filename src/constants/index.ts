import type { MenuItem, SearchExample, StatisticsData } from '@/types';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'spellingregels', href: '/spellingregels', label: 'Spellingregels' },
  { id: 'taaladvies', href: '/taaladvies', label: 'Taaladvies' }
];

export const SEARCH_EXAMPLES: SearchExample[] = [
  { search: '*vakantie', result: 'alle woorden die op vakantie eindigen' },
  { search: 'v?n', result: 'van, ven, vin' },
  { search: 'v?n??', result: 'vanen, venen' },
  { search: 'v?n*n', result: 'vang aan, vink aan, vannen, van jongs af aan' },
  { search: 'boven*in', result: 'boven in, bovenin' },
  { search: 'boven?in', result: 'boven in' }
];

export const STATISTICS_DATA: StatisticsData[] = [
  {
    id: 'trefwoorden',
    value: '229.862',
    label: 'AANTAL TREFWOORDEN'
  },
  {
    id: 'woordvormen', 
    value: '848.203',
    label: 'AANTAL WOORDVORMEN'
  }
];

export const FLOATING_CHARS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

export const ANIMATION_PATHS = ['float', 'spiral', 'wave', 'bounce'] as const;
export const ANIMATION_DIRECTIONS = ['normal', 'reverse', 'alternate'] as const;
export const FONT_WEIGHTS = [
  'font-thin', 
  'font-extralight', 
  'font-light', 
  'font-medium', 
  'font-semibold', 
  'font-black'
] as const;