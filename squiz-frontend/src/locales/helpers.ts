import MemberPlusHeroBR from 'assets_2/images/membersplus/v2/hero/br.jpg';
import MemberPlusHeroDE from 'assets_2/images/membersplus/v2/hero/de.jpg';
import MemberPlusHeroEN from 'assets_2/images/membersplus/v2/hero/en.jpg';
import MemberPlusHeroES from 'assets_2/images/membersplus/v2/hero/es.jpg';
import MemberPlusHeroFR from 'assets_2/images/membersplus/v2/hero/fr.jpg';
import MemberPlusHeroNL from 'assets_2/images/membersplus/v2/hero/nl.jpg';
import { Locales } from './i18nLingui';
import { localConfigs } from './LocalConfigs';

interface Language {
  name: string;
  locale: Locales;
}

export const defaultLanguageSelector = {
  name: 'USA',
  locale: Locales.English
};

export const languagesSelectorList: Language[] = [
  {
    name: 'Australia',
    locale: Locales.EnglishAustralia
  },
  {
    name: 'Brasil',
    locale: Locales.BrazilianPortuguese
  },
  {
    name: 'Canada',
    locale: Locales.EnglishCanada
  },
  {
    name: 'Canada (Français)',
    locale: Locales.FrenchCanada
  },
  {
    name: 'Deutschland',
    locale: Locales.GermanGermany
  },
  {
    name: 'España',
    locale: Locales.SpanishSpain
  },
  {
    name: 'France',
    locale: Locales.FrenchFrance
  },
  {
    name: 'India',
    locale: Locales.EnglishIndia
  },
  {
    name: 'Italia',
    locale: Locales.Italian
  },
  {
    name: 'México',
    locale: Locales.SpanishMexico
  },
  {
    name: 'Nederland',
    locale: Locales.Dutch
  },
  {
    name: 'Österreich',
    locale: Locales.German
  },
  {
    name: 'Schweiz',
    locale: Locales.German
  },
  {
    name: 'Suisse',
    locale: Locales.French
  },
  {
    name: 'United Kingdom',
    locale: Locales.EnglishUK
  },
  defaultLanguageSelector
];

export interface LocalPathInterface {
  basePath?: string;
  contentPath?: string;
  getRelativeUrl: () => string;
}

export class LocalPath implements LocalPathInterface {
  basePath?: string;

  contentPath?: string;

  constructor(basePath?: string, contentPath?: string) {
    this.basePath = basePath;
    this.contentPath = contentPath;
  }

  getRelativeUrl() {
    if (this.basePath) return `/${this.basePath}/${this.contentPath}`;
    return `/${this.contentPath}`;
  }
}

export const getSupportedLocale = (iso?: string) => {
  if (!iso) {
    return Locales.English;
  }

  if (iso.startsWith('de')) {
    return Locales.German;
  }
  if (iso.startsWith('es')) {
    return Locales.Spanish;
  }
  if (iso.startsWith('it')) {
    return Locales.Italian;
  }
  if (iso.startsWith('nl')) {
    return Locales.Dutch;
  }
  if (iso.startsWith('fr')) {
    return Locales.French;
  }
  if (iso === 'pt-BR') {
    return Locales.BrazilianPortuguese;
  }
  return Locales.English;
};

const teacherUrl = (locale: Locales, username?: string) => {
  switch (locale) {
    case Locales.German:
    case Locales.GermanGermany:
      return `${localConfigs[Locales.German].meditationTeachers}/${username}`;
    case Locales.Spanish:
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return `${localConfigs[Locales.Spanish].meditationTeachers}/${username}`;
    case Locales.BrazilianPortuguese:
    case Locales.Russian:
      return `${localConfigs[locale].meditationTeachers}/${username}`;
    case Locales.French:
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return `${localConfigs[Locales.French].meditationTeachers}/${username}`;
    case Locales.Dutch:
      return `${localConfigs[Locales.Dutch].meditationTeachers}/${username}`;
    case Locales.Italian:
      return `${localConfigs[Locales.Italian].meditationTeachers}/${username}`;
    default:
      return `${username}`;
  }
};

const singlesUrl = (locale: Locales, slug: string, username?: string) => {
  switch (locale) {
    case Locales.German:
    case Locales.GermanGermany:
      return `${localConfigs[Locales.German].guidedMeditations}/${slug}`;
    case Locales.Spanish:
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return `${localConfigs[Locales.Spanish].guidedMeditations}/${slug}`;
    case Locales.BrazilianPortuguese:
    case Locales.Russian:
      return `${localConfigs[locale].guidedMeditations}/${slug}`;
    case Locales.French:
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return `${localConfigs[Locales.French].guidedMeditations}/${slug}`;
    case Locales.Dutch:
      return `${localConfigs[Locales.Dutch].guidedMeditations}/${slug}`;
    case Locales.Italian:
      return `${localConfigs[Locales.Italian].guidedMeditations}/${slug}`;
    default:
      return `${username}/guided-meditations/${slug}`;
  }
};

const courseUrl = (locale: Locales, slug: string) => {
  switch (locale) {
    case Locales.German:
    case Locales.GermanGermany:
      return `${localConfigs[Locales.German].meditationCourses}/${slug}`;
    case Locales.Spanish:
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return `${localConfigs[Locales.Spanish].meditationCourses}/${slug}`;
    case Locales.BrazilianPortuguese:
    case Locales.Russian:
      return `${localConfigs[locale].meditationCourses}/${slug}`;
    case Locales.French:
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return `${localConfigs[Locales.French].meditationCourses}/${slug}`;
    case Locales.Dutch:
      return `${localConfigs[Locales.Dutch].meditationCourses}/${slug}`;
    case Locales.Italian:
      return `${localConfigs[Locales.Italian].meditationCourses}/${slug}`;
    default:
      return `${localConfigs[Locales.English].meditationCourses}/${slug}`;
  }
};

const notifyLanguage = (locale: Locales) => {
  switch (locale) {
    case Locales.German:
    case Locales.GermanGermany:
      return 'Deutsch besuchen';
    case Locales.Spanish:
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return 'Español!';
    case Locales.BrazilianPortuguese:
      return 'Português do Brasil';
    case Locales.French:
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return 'Français.';
    case Locales.Dutch:
      return 'Nederlands bezoeken';
    case Locales.Italian:
      return 'Italiano';
    default:
      return null;
  }
};

const notifyString = (locale: Locales) => {
  switch (locale) {
    case Locales.German:
    case Locales.GermanGermany:
      return 'Du kannst unsere Webseite auch auf';
    case Locales.Spanish:
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return '¡Puedes visitar nuestra página en';
    case Locales.BrazilianPortuguese:
      return 'Por favor, visite esta página em';
    case Locales.French:
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return 'Vous pouvez aussi visiter notre site web en';
    case Locales.Dutch:
      return 'U kunt onze website ook in het';
    case Locales.Italian:
      return 'Puoi anche visitare il sito in';
    default:
      return null;
  }
};

/**
 * returns the home page url for this locale
 * @param locale
 */
const homeUrl = (locale: Locales) => {
  if (sessionStorage.getItem('language')) {
    return `/${sessionStorage.getItem('language')}`;
  }

  switch (locale) {
    case Locales.BrazilianPortuguese:
      return '/br';
    case Locales.PseudoLocale:
    case Locales.English:
      return '/';
    default:
      return `/${locale.toString()}`;
  }
};

/**
 * returns the base locale for this locale (eg. de-de, returns de)
 * @param locale
 */
export const getBaseLocale = (locale: Locales) => {
  switch (locale) {
    case Locales.GermanGermany:
      return Locales.German;
    case Locales.SpanishSpain:
    case Locales.SpanishMexico:
      return Locales.Spanish;
    case Locales.FrenchFrance:
    case Locales.FrenchCanada:
      return Locales.French;
    case Locales.EnglishAustralia:
    case Locales.EnglishCanada:
    case Locales.EnglishUK:
    case Locales.EnglishIndia:
      return Locales.English;
    default:
      return locale;
  }
};

/**
 * browse guided-meditations path
 * @param locale
 */
const browsePath = (locale: Locales) => {
  return localConfigs[getBaseLocale(locale)].guidedMeditations;
};

/**
 * returns the blog page url for this locale
 * @param locale
 */
const blogUrl = (locale: Locales) => {
  switch (locale) {
    case Locales.PseudoLocale:
    case Locales.English:
      return `${process.env.REACT_APP_WEBAPP_HOST}/blog`;
    default:
      return `${process.env.REACT_APP_WEBAPP_HOST}/blog/${getBaseLocale(
        locale
      )}`;
  }
};

export const getSessionLanguage = () => {
  const sessionLanguage = sessionStorage.getItem('language');

  if (!sessionLanguage) {
    return defaultLanguageSelector;
  }

  if (sessionLanguage === 'br') {
    return {
      name: 'Brasil',
      locale: Locales.BrazilianPortuguese
    };
  }

  return languagesSelectorList.find(
    language => language.locale === sessionLanguage
  );
};

export const setSessionLanguage = (locale: Locales) => {
  if (locale === Locales.English) {
    sessionStorage.setItem('language', '');
  } else if (locale === Locales.BrazilianPortuguese) {
    sessionStorage.setItem('language', 'br');
  } else {
    sessionStorage.setItem('language', locale);
  }
};

const memberPlusHero = (locale: Locales) => {
  switch (locale) {
    case Locales.German:
      return MemberPlusHeroDE;
    case Locales.Spanish:
      return MemberPlusHeroES;
    case Locales.BrazilianPortuguese:
      return MemberPlusHeroBR;
    case Locales.French:
      return MemberPlusHeroFR;
    case Locales.Dutch:
      return MemberPlusHeroNL;
    default:
      return MemberPlusHeroEN;
  }
};

export const taxonomy = (locale: Locales) => {
  const localConfig = localConfigs[getBaseLocale(locale)];
  return {
    config: localConfig,
    getTeacherUrl: (username?: string) =>
      new LocalPath(
        localConfig.home,
        teacherUrl(locale, username)
      ).getRelativeUrl(),
    getSinglesUrl: (slug: string, username?: string) =>
      new LocalPath(
        localConfig.home,
        singlesUrl(locale, slug, username)
      ).getRelativeUrl(),
    getBrowseUrl: () =>
      new LocalPath(localConfig.home, browsePath(locale)).getRelativeUrl(),
    getCourseUrl: (slug: string) =>
      new LocalPath(localConfig.home, courseUrl(locale, slug)).getRelativeUrl(),
    getHomeUrl: () => homeUrl(locale),
    getBlogUrl: () => blogUrl(locale),
    getResetPasswordUrl: () =>
      new LocalPath(
        localConfig.home,
        localConfig.resetPassword
      ).getRelativeUrl(),
    getFreeTrialUrl: () =>
      new LocalPath(localConfig.home, localConfig.freeTrial).getRelativeUrl(),
    getNotificationString: () => notifyString(locale),
    getNotificationLanguage: () => notifyLanguage(locale),
    getMemberPlusHero: () => memberPlusHero(locale)
  };
};
