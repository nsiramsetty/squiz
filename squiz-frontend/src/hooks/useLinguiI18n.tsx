import { I18n } from '@lingui/core';
import { i18n } from 'locales/i18nLingui';
import React, { useContext } from 'react';

const LinguiI18nContext = React.createContext<I18n>(i18n);

export const LinguiI18nContextProvider: React.FC = ({ children }) => {
  return (
    <LinguiI18nContext.Provider value={i18n}>
      {children}
    </LinguiI18nContext.Provider>
  );
};

export const useLinguiI18n = () => useContext(LinguiI18nContext);
