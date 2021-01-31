import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { useTaxonomy } from 'hooks/useTaxonomy';
import { Locales } from 'locales/i18nLingui';
import React, { FC } from 'react';
import { isIOS, isSafari } from 'react-device-detect';
import { Course } from 'services/courses';
import { LibraryItem } from 'services/singles';
import { User } from 'services/teacher';
import NotifyLink from './NotifyLink';
import NotifyMessage from './NotifyMessage';

const getNotifyDeviceLocale = (siteLanguage: string) => {
  const { language } = window.navigator;

  // if site language matches device language, then don't notify.
  if (language.toLowerCase() === siteLanguage.toLowerCase()) {
    return null;
  }

  // if site language is any other language, then also don't notify.
  if (siteLanguage !== Locales.English) {
    return null;
  }

  // BR
  if (isIOS || isSafari) {
    if (language === 'pt' || language === Locales.BrazilianPortuguese)
      return Locales.BrazilianPortuguese;
  }

  if (language === Locales.BrazilianPortuguese)
    return Locales.BrazilianPortuguese;

  // es
  if (language.startsWith('es')) {
    switch (language) {
      case 'es-ES':
        return Locales.SpanishSpain;
      case 'es-MX':
        return Locales.SpanishMexico;
      default:
        return Locales.Spanish;
    }
  }

  // de
  if (language.startsWith('de')) {
    switch (language) {
      case 'de-DE':
        return Locales.GermanGermany;
      default:
        return Locales.German;
    }
  }

  // fr
  if (language.startsWith('fr')) {
    switch (language) {
      case 'fr-FR':
        return Locales.FrenchFrance;
      case 'fr-CA':
        return Locales.FrenchCanada;
      default:
        return Locales.French;
    }
  }

  // nl
  if (language === Locales.Dutch) return Locales.Dutch;

  // it
  if (language === Locales.Italian) return Locales.Italian;

  return null;
};

const NotifyLocale: FC<{
  course?: Course;
  single?: LibraryItem;
  teacher?: User;
}> = ({ course, single, teacher }) => {
  const i18n = useLinguiI18n();
  const notifyDeviceLocale = getNotifyDeviceLocale(i18n.language);
  const taxonomy = useTaxonomy(notifyDeviceLocale || Locales.English);

  if (notifyDeviceLocale == null) return null;

  let url = taxonomy.getHomeUrl();

  if (course) url = taxonomy.getCourseUrl(course.slug);
  if (single)
    url = taxonomy.getSinglesUrl(single.slug, single.publisher.username);
  if (teacher) url = taxonomy.getTeacherUrl(teacher.username);

  const notifyLanguage = taxonomy.getNotificationLanguage();
  const notifyString = taxonomy.getNotificationString();

  if (notifyString != null && notifyLanguage != null)
    return (
      <NotifyMessage id={`${notifyDeviceLocale}-notification`}>
        {notifyString}
        <NotifyLink to={url}>{notifyLanguage}</NotifyLink>
      </NotifyMessage>
    );

  return null;
};

export default NotifyLocale;
