import { Locales } from './i18nLingui';

export interface LocalConfig {
  home: string;
  guidedMeditations: string;
  meditationTeachers: string;
  meditationCourses: string;
  resetPassword: string;
  freeTrial: string;
  play: string;
  deviceLang: string;
  contentLangs: string;
}

interface LocalConfigs {
  [keys: string]: LocalConfig;
}

export const localConfigs: LocalConfigs = {
  [Locales.English]: {
    home: '',
    guidedMeditations: 'guided-meditations',
    meditationTeachers: '',
    meditationCourses: 'meditation-courses',
    resetPassword: 'reset-password',
    freeTrial: 'subscribe/free-trial',
    play: 'play',
    deviceLang: 'en',
    contentLangs: 'en'
  },
  [Locales.BrazilianPortuguese]: {
    home: 'br',
    guidedMeditations: 'meditacao-guiada',
    meditationTeachers: 'professores',
    meditationCourses: 'cursos',
    resetPassword: 'redefina-senha',
    freeTrial: 'assine/teste-gratuito',
    play: 'tocar',
    deviceLang: 'pt-BR',
    contentLangs: 'pt-BR,pt'
  },
  [Locales.French]: {
    home: 'fr',
    guidedMeditations: 'meditation-guidee',
    meditationTeachers: 'professeur',
    meditationCourses: 'cours-de-meditation',
    resetPassword: 'reinitialiser',
    freeTrial: 'abonnez-vous/essai-gratuit',
    play: 'play',
    deviceLang: 'fr',
    contentLangs: 'fr'
  },
  [Locales.Russian]: {
    home: 'ru',
    guidedMeditations: 'gid-meditacii',
    meditationTeachers: 'meditacija-uchitelja',
    meditationCourses: 'kursy-meditacii',
    resetPassword: 'sbros-parolja',
    freeTrial: '',
    play: 'play',
    deviceLang: 'ru',
    contentLangs: 'ru'
  },
  [Locales.German]: {
    home: 'de',
    guidedMeditations: 'gefuehrte-meditation',
    meditationTeachers: 'meditationslehrer',
    meditationCourses: 'meditationskurse',
    resetPassword: '',
    freeTrial: 'abonnieren/testphase',
    play: 'abspielen',
    deviceLang: 'de',
    contentLangs: 'de'
  },
  [Locales.Spanish]: {
    home: 'es',
    guidedMeditations: 'meditacion-guiada',
    meditationTeachers: 'profesores',
    meditationCourses: 'cursos-de-meditacion',
    resetPassword: 'restablecer-contrasena',
    freeTrial: 'suscribir/prueba-gratis',
    play: 'tocar',
    deviceLang: 'es',
    contentLangs: 'es'
  },
  [Locales.Dutch]: {
    home: 'nl',
    guidedMeditations: 'geleide-meditatie',
    meditationTeachers: 'docent',
    meditationCourses: 'meditatiecursus',
    resetPassword: 'opnieuw-instellen',
    freeTrial: 'abonneren/proefabonnement',
    play: 'play',
    deviceLang: 'nl',
    contentLangs: 'nl'
  },
  [Locales.Italian]: {
    home: 'it',
    guidedMeditations: 'meditazione-guidata',
    meditationTeachers: 'insegnante',
    meditationCourses: 'corso-di-meditazione',
    resetPassword: 'resetta',
    freeTrial: '',
    play: 'play',
    deviceLang: 'it',
    contentLangs: 'it'
  }
};
