import * as _ from 'lodash';
import { SupportedLanguage } from '../../shared/enum';

export function getCombinedLanguages(deviceLang: string | undefined, contentLangs: string): string[] {
  let combinedLanguages: string[] = [];
  if (contentLangs && contentLangs.trim() !== '') {
    contentLangs
      .split(',')
      .filter((l): boolean => l.trim() !== '')
      .map((l): string => l.trim())
      .forEach((l): number => combinedLanguages.push(l));
  }
  if (deviceLang && combinedLanguages.length === 0) {
    if (combinedLanguages.indexOf(deviceLang) === -1) {
      combinedLanguages.push(deviceLang);
    }
  }
  combinedLanguages = _.uniq(combinedLanguages);
  return combinedLanguages;
}

export function validateAndReplaceWithEnglish(requestedLangs: string[], supportedLangs?: string[]): string[] {
  if (!requestedLangs || (Array.isArray(requestedLangs) && requestedLangs.length === 0)) {
    return ['en'];
  }
  let supportedLangCodes: string[];
  if (supportedLangs && Array.isArray(supportedLangs) && supportedLangs.length > 0) {
    supportedLangCodes = supportedLangs;
  } else {
    supportedLangCodes = Object.values(SupportedLanguage);
  }
  const result = requestedLangs.map((l): string => {
    if (supportedLangCodes.indexOf(l) < 0) {
      return 'en';
    }
    return l;
  });
  return _.uniq(result);
}
