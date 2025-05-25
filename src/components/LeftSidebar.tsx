'use client';

import React, { memo } from 'react';

interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = memo(({ className = '' }) => {
  return (
    <div className={`bg-white w-[682px] ${className}`}>
      {/* Hoe zoek ik op Woordenlijst.org Section */}
      <section className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-normal text-[#005983] mb-6">
          <span>Hoe zoek ik op </span>
          <span className="font-semibold">Woordenlijst.org</span>
          <span>?</span>
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-normal text-[#0D7C96] mb-4">
              Jokers gebruiken
            </h2>
            
            <p className="text-base text-[#212529] mb-4 leading-relaxed">
              Je kunt je zoekopdracht verfijnen aan de hand van de volgende jokers of wildcards:
            </p>

            <div className=" rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-[#212529] mr-3">?</span>
                  <span className="text-[#212529]">staat voor exact één willekeurig karakter</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-[#212529] mr-3">*</span>
                  <span className="text-[#212529]">staat voor geen, één of meer willekeurige karakters</span>
                </div>
              </div>
            </div>

            <p className="text-base text-[#212529] mb-4">
              Het is ook mogelijk om jokers in een zoekopdracht te combineren.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#212529] mb-4">
              Voorbeelden:
            </h3>

            <div>
              {[
                { search: '*vakantie', result: 'alle woorden die op vakantie eindigen' },
                { search: 'v?n', result: 'van, ven, vin' },
                { search: 'v?n??', result: 'vanen, venen' },
                { search: 'v?n*n', result: 'vang aan, vink aan, vannen, van jongs af aan' },
                { search: 'boven*in', result: 'boven in, bovenin' },
                { search: 'boven?in', result: 'boven in' }
              ].map((example, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center">
                  <code className="text-[#212529]">
                    {example.search}
                  </code>
                  <span className="text-[#212529] text-sm">→ {example.result}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="inline-flex items-center text-[#182B49] font-medium">
            <span>Lees verder</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Wat vind ik op Woordenlijst.org Section */}
      <section className="mt-[18px] mb-12">
        <h2 className="text-2xl font-normal text-[#005983] mb-6">
          Wat vind ik op <span className="font-semibold">Woordenlijst.org</span>?
        </h2>
        
        <p className="text-base text-[#212529] mb-6">
          In de Woordenlijst vind je o.a.:
        </p>

        <div>
          <ul className="list-disc list-inside text-[#212529]">
            <li>
              de officiële <strong>spelling</strong> van woorden
            </li>
            <li>
              alle mogelijke <strong>vormen</strong> (vervoegingen en verbuigingen) die een woord kan aannemen
            </li>
            <li>
              de <strong>woordsoort</strong> van elk woord (zelfstandig naamwoord, voegwoord, etc.)
            </li>
            <li>
              <strong>afbrekingen</strong>: op welke punten kun je een woord afbreken?
            </li>
            <li>
              korte <strong>betekenissen</strong> bij woorden die hetzelfde klinken (<em>lijden</em> en <em>leiden</em>) of die je hetzelfde schrijft (<em>golf</em> = 'spel', 'baar' en 'baai'), zodat je ze uit elkaar kunt houden.
            </li>
            <li>
              voluit geschreven vormen van <strong>afkortingen</strong>
            </li>
            <li>
              <strong>verkleinwoorden</strong> bij zelfstandige naamwoorden (indien aanwezig; werk in uitvoering)
            </li>
            <li>
              <strong>uitspraakinformatie</strong> (indien aanwezig; werk in uitvoering)
            </li>
            <li>
              extra <strong>toelichting</strong> bij de spelling (indien van toepassing)
            </li>
          </ul>
        </div>
      </section>

      {/* Over Woordenlijst.org Section */}
      <section className="">
        <h2 className="text-2xl font-normal text-[#005983] mb-2">
          Over <span className="font-semibold">Woordenlijst.org</span>
        </h2>

        <div className="">
          <article className="text-[#212529]">
            <h3 className="text-lg font-semibold mb-4">
              Officiële spelling
            </h3>
            <p className="text-base leading-relaxed mb-4">
              Op Woordenlijst.org vind je de Woordenlijst Nederlandse Taal: de lijst met de officiële spelling van het Nederlands. Het
              woordenbestand en de applicatie worden ontwikkeld en beheerd door het Instituut voor de Nederlandse Taal (INT) in opdracht van de
              Taalunie. In Nederland en Vlaanderen is de officiële spelling verplicht voor het onderwijs en de overheid. Het Comité van Ministers van
              de Taalunie stelt de spelling vast. De{' '}
              <button className="text-[#1976D2] hover:text-[#1565C0] underline transition-colors duration-200">
                Commissie Spelling
              </button>{' '}
              ondersteunt de Taalunie bij het uitvoeren van deze taak en begeleidt de actualisering van Woordenlijst.org.
            </p>
          </article>

          <article className="">
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
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-evenly items-center text-base px-3">
          {/* Leidraad Button */}
          <button className="bg-[#182B49] text-white px-3 py-[6px] rounded-lg font-medium hover:bg-[#2B4A5A]/90 transition-colors duration-200 min-w-[246px]">
            Leidraad
          </button>

          {/* Technische handleiding Button */}
          <button className="bg-[#182B49] text-white px-3 py-[6px] rounded-lg font-medium hover:bg-[#2B4A5A]/90 transition-colors duration-200 min-w-[246px]">
            Technische handleiding
          </button>
        </div>
      </section>
    </div>
  );
});

LeftSidebar.displayName = 'LeftSidebar';

export default LeftSidebar;