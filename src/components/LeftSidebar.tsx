'use client';

import React, { memo, useEffect, useState } from 'react';
import type { BaseComponentProps, SearchExample } from '@/types';
import { SEARCH_EXAMPLES } from '@/constants';

interface LeftSidebarProps extends BaseComponentProps {}

const LeftSidebar: React.FC<LeftSidebarProps> = memo(({ className = '' }) => {
  return (
    <div className={`bg-white w-[682px] ${className}`}>
      {/* How to search section */}
      <SearchGuideSection />
      
      {/* What to find section */}
      <ContentSection />
      
      {/* About section */}
      <AboutSection />
      
      {/* Action buttons */}
      <ActionButtonsSection />
    </div>
  );
});

// Search Guide Section Component
const SearchGuideSection = memo(() => (
  <section className="mb-4">
    <h1 className="text-2xl lg:text-3xl font-normal text-primary-500 mb-6">
      <span>Hoe zoek ik op </span>
      <span className="font-semibold">Woordenlijst.org</span>
      <span>?</span>
    </h1>

    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-normal text-secondary-500 mb-4">
          Jokers gebruiken
        </h2>
        
        <p className="text-base text-text-primary mb-4 leading-relaxed">
          Je kunt je zoekopdracht verfijnen aan de hand van de volgende jokers of wildcards:
        </p>

        <WildcardGuide />

        <p className="text-base text-text-primary mb-4">
          Het is ook mogelijk om jokers in een zoekopdracht te combineren.
        </p>
      </div>

      <SearchExamples />

      <button className="inline-flex items-center text-button-primary font-medium hover:text-button-primary/80 transition-colors">
        <span>Lees verder</span>
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </section>
));

// Wildcard Guide Component
const WildcardGuide = memo(() => (
  <div className="rounded-lg p-4 mb-4">
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-lg font-bold text-text-primary mr-3">?</span>
        <span className="text-text-primary">staat voor exact één willekeurig karakter</span>
      </div>
      <div className="flex items-center">
        <span className="text-lg font-bold text-text-primary mr-3">*</span>
        <span className="text-text-primary">staat voor geen, één of meer willekeurige karakters</span>
      </div>
    </div>
  </div>
));

// Search Examples Component
const SearchExamples = memo(() => (
  <div>
    <h3 className="text-base font-bold text-text-primary mb-4">
      Voorbeelden:
    </h3>

    <div className="space-y-1">
      {SEARCH_EXAMPLES.map((example, index) => (
        <SearchExampleItem key={index} example={example} />
      ))}
    </div>
  </div>
));

// Search Example Item Component
const SearchExampleItem = memo<{ example: SearchExample }>(({ example }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
    <code className="text-text-primary font-mono">{example.search}</code>
    <span className="text-text-primary text-sm">→ {example.result}</span>
  </div>
));

// Content Section Component
const ContentSection = memo(() => (
  <section className="mt-[18px] mb-12">
    <h2 className="text-2xl font-normal text-primary-500 mb-6">
      Wat vind ik op <span className="font-semibold">Woordenlijst.org</span>?
    </h2>
    
    <p className="text-base text-text-primary mb-6">
      In de Woordenlijst vind je o.a.:
    </p>

    <ContentList />
  </section>
));

// Content List Component
const ContentList = memo(() => {
  const contentItems = [
    'de officiële **spelling** van woorden',
    'alle mogelijke **vormen** (vervoegingen en verbuigingen) die een woord kan aannemen',
    'de **woordsoort** van elk woord (zelfstandig naamwoord, voegwoord, etc.)',
    '**afbrekingen**: op welke punten kun je een woord afbreken?',
    'korte **betekenissen** bij woorden die hetzelfde klinken (*lijden* en *leiden*) of die je hetzelfde schrijft (*golf* = \'spel\', \'baar\' en \'baai\'), zodat je ze uit elkaar kunt houden.',
    'voluit geschreven vormen van **afkortingen**',
    '**verkleinwoorden** bij zelfstandige naamwoorden (indien aanwezig; werk in uitvoering)',
    '**uitspraakinformatie** (indien aanwezig; werk in uitvoering)',
    'extra **toelichting** bij de spelling (indien van toepassing)'
  ];

  return (
    <ul className="list-disc list-inside text-text-primary space-y-1">
      {contentItems.map((item, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
});

// About Section Component
const AboutSection = memo(() => (
  <section>
    <h2 className="text-2xl font-normal text-primary-500 mb-2">
      Over <span className="font-semibold">Woordenlijst.org</span>
    </h2>

    <div className="space-y-6">
      <OfficialSpellingArticle />
      <SpellingRulesArticle />
    </div>
  </section>
));

// Official Spelling Article Component
const OfficialSpellingArticle = memo(() => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupText, setPopupText] = useState('');

  // Fetch text dari file saat komponen mount
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch('/text.txt');
        const text = await response.text();
        setPopupText(text);
      } catch (error) {
        console.error('Error loading text file:', error);
        setPopupText('Maaf, konten tidak dapat dimuat.');
      }
    };

    fetchText();
  }, []);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <article className="text-text-primary">
        <h3 className="text-lg font-semibold mb-4">
          Officiële{' '}
          <button 
            onClick={openPopup}
            className="text-lg font-semibold hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          >
            spelling
          </button>
        </h3>
        <p className="text-base leading-relaxed mb-4">
          Op Woordenlijst.org vind je de Woordenlijst Nederlandse Taal: de lijst met de officiële spelling van het Nederlands. Het
          woordenbestand en de applicatie worden ontwikkeld en beheerd door het Instituut voor de Nederlandse Taal (INT) in opdracht van de
          Taalunie. In Nederland en Vlaanderen is de officiële spelling verplicht voor het onderwijs en de overheid. Het Comité van Ministers van
          de Taalunie stelt de spelling vast. De{' '}
          <button className="text-link hover:text-link-hover underline transition-colors duration-200">
            Commissie Spelling
          </button>{' '}
          ondersteunt de Taalunie bij het uitvoeren van deze taak en begeleidt de actualisering van Woordenlijst.org.
        </p>
      </article>

      {/* Pop-up Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-auto p-6 relative">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            >
              ×
            </button>
            
            {/* Content */}
            <div className="pr-8">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">
                Spelling Informatie
              </h4>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {popupText}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// Spelling Rules Article Component
const SpellingRulesArticle = memo(() => (
  <article>
    <h3 className="text-lg font-semibold mb-4">
      Spellingregels
    </h3>
    <p className="text-base leading-relaxed">
      De regels voor de officiële spelling staan in de Leidraad van de Woordenlijst. De Technische Handleiding is een uitgebreider overzicht
      van de spellingregels van het Nederlands. Deze tekst biedt meer specifieke regels, principes en nuanceringen dan de Leidraad. De
      Leidraad, de Woordenlijst en de Technische Handleiding zijn de grondslag voor beslissingen van de Commissie Spelling over de
      spelling van woorden.
    </p>
  </article>
));

// Action Buttons Section Component
const ActionButtonsSection = memo(() => (
  <section className="mt-4">
    <div className="flex flex-col sm:flex-row gap-4 justify-evenly items-center text-base px-3">
      <ActionButton>Leidraad</ActionButton>
      <ActionButton>Technische handleiding</ActionButton>
    </div>
  </section>
));

// Action Button Component
const ActionButton = memo<{ children: React.ReactNode }>(({ children }) => (
  <button className="bg-button-primary text-white px-3 py-[6px] rounded-lg font-medium hover:bg-button-secondary/90 transition-colors duration-200 min-w-[246px]">
    {children}
  </button>
));

SearchGuideSection.displayName = 'SearchGuideSection';
WildcardGuide.displayName = 'WildcardGuide';
SearchExamples.displayName = 'SearchExamples';
SearchExampleItem.displayName = 'SearchExampleItem';
ContentSection.displayName = 'ContentSection';
ContentList.displayName = 'ContentList';
AboutSection.displayName = 'AboutSection';
OfficialSpellingArticle.displayName = 'OfficialSpellingArticle';
SpellingRulesArticle.displayName = 'SpellingRulesArticle';
ActionButtonsSection.displayName = 'ActionButtonsSection';
ActionButton.displayName = 'ActionButton';
LeftSidebar.displayName = 'LeftSidebar';

export default LeftSidebar;