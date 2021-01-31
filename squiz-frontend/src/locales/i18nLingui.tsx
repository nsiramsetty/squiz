/* eslint-disable import/extensions */
import { setupI18n } from '@lingui/core';
import messagesDe from 'locales/de/messages.js';
import messagesEn from 'locales/en/messages.js';
import messagesEs from 'locales/es/messages.js';
import messagesFr from 'locales/fr/messages.js';
import messagesIt from 'locales/it/messages.js';
import messagesNl from 'locales/nl/messages.js';
import messagesPseudoLOCALE from 'locales/pseudo-LOCALE/messages.js';
import messagesPtBr from 'locales/pt-BR/messages.js';
import messagesRu from 'locales/ru/messages.js';
import numeral from 'numeral';
import './i18nMark';
import './i18nMarkCities';

export enum Locales {
  English = 'en',
  BrazilianPortuguese = 'pt-BR',
  Spanish = 'es',
  SpanishSpain = 'es-es',
  French = 'fr',
  FrenchFrance = 'fr-fr',
  FrenchCanada = 'fr-ca',
  German = 'de',
  GermanGermany = 'de-de',
  Russian = 'ru',
  SpanishMexico = 'es-mx',
  PseudoLocale = 'pseudo-LOCALE',
  Dutch = 'nl',
  Italian = 'it',
  EnglishAustralia = 'en-au',
  EnglishCanada = 'en-ca',
  EnglishUK = 'en-gb',
  EnglishIndia = 'en-in'
}

export const catalogs = {
  [Locales.English]: messagesEn,
  [Locales.BrazilianPortuguese]: messagesPtBr,
  [Locales.Spanish]: messagesEs,
  [Locales.French]: messagesFr,
  [Locales.German]: messagesDe,
  [Locales.Russian]: messagesRu,
  [Locales.PseudoLocale]: messagesPseudoLOCALE,
  [Locales.Dutch]: messagesNl,
  [Locales.Italian]: messagesIt
};

export const i18n = setupI18n({
  language: Locales.English,
  catalogs
});

numeral.register('locale', 'en+', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'k',
    million: 'million',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    const b = number % 10;
    return ~~((number % 100) / 10) === 1
      ? 'th'
      : b === 1
      ? 'st'
      : b === 2
      ? 'nd'
      : b === 3
      ? 'rd'
      : 'th';
  },
  currency: {
    symbol: '$'
  }
});

numeral.register('locale', 'pt+', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'mil',
    million: 'milhoes',
    billion: 'b',
    trillion: 't'
  },
  ordinal(number) {
    const b = number % 10;
    return ~~((number % 100) / 10) === 1
      ? 'th'
      : b === 1
      ? 'st'
      : b === 2
      ? 'nd'
      : b === 3
      ? 'rd'
      : 'th';
  },
  currency: {
    symbol: '$'
  }
});
