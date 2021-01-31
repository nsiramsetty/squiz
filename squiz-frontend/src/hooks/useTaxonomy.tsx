import { taxonomy } from 'locales/helpers';
import { Locales } from 'locales/i18nLingui';
import { useMemo } from 'react';
import { useLinguiI18n } from './useLinguiI18n';

export function useTaxonomy(locale?: Locales) {
  const i18n = useLinguiI18n();
  return useMemo(() => taxonomy(locale || (i18n.language as Locales)), [
    locale,
    i18n.language
  ]);
}
