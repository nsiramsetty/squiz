import { Box, Container } from '@material-ui/core';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useSinglesTrackQuery } from 'hooks/queries/useSinglesTrackQuery';
import {
  getSessionLanguage,
  languagesSelectorList,
  setSessionLanguage,
  taxonomy
} from 'locales/helpers';
import { Locales } from 'locales/i18nLingui';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ReactComponent as DownIcon } from './assets/down.svg';
import { ReactComponent as GlobeIcon } from './assets/globe.svg';
import {
  LanguageButton,
  LanguageButtonIndicator,
  LanguagePopover,
  SelectorButton,
  SelectorButtonLabel
} from './styled';

interface PageParams {
  slug?: string;
  teacher?: string;
}

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  const activeLanguage = getSessionLanguage();
  const { pageType } = usePageViewTracker();
  const { slug, teacher } = useParams<PageParams>();
  const { libraryItem, loadData: loadLibraryItems } = useSinglesTrackQuery();

  const handleClickSelector = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (pageType === 'gm_details_page' && slug) {
      loadLibraryItems(slug);
    }
  }, [loadLibraryItems, pageType, slug]);

  const handleChangeLanguage = (locale: Locales) => {
    const taxonomyLang = taxonomy(locale);
    setSessionLanguage(locale);

    // reset password page
    if (pageType === 'reset_password_page') {
      history.push(taxonomyLang.getResetPasswordUrl());
    }

    // teacher page
    else if (pageType === 'teacher_profile_page') {
      history.push(taxonomyLang.getTeacherUrl(slug));
    }

    // course detail page
    else if (pageType === 'course_details_page') {
      if (slug) {
        history.push(taxonomyLang.getCourseUrl(slug));
      }
    }

    // gm detail page
    else if (pageType === 'gm_details_page') {
      if (slug)
        history.push(
          taxonomyLang.getSinglesUrl(
            slug,
            teacher || libraryItem?.publisher.username
          )
        );
    }

    // other page
    else {
      history.push(taxonomyLang.getHomeUrl());
    }
    setIsOpen(false);
  };

  return (
    <>
      <Box pr="10px">
        <SelectorButton
          ref={selectorRef}
          disableRipple
          onClick={handleClickSelector}
        >
          <Box width="10px">
            <GlobeIcon />
          </Box>
          <Box width="10px" />
          <SelectorButtonLabel>{activeLanguage?.name}</SelectorButtonLabel>
          <Box width="10px" />
          <Box pt="1px">
            <DownIcon />
          </Box>
        </SelectorButton>
      </Box>
      <LanguagePopover
        id="language-selector"
        open={isOpen}
        anchorEl={selectorRef.current}
        onClose={() => {
          setIsOpen(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Container>
          {languagesSelectorList.map(language => (
            <LanguageButton
              key={language.name}
              disableRipple
              onClick={() => {
                handleChangeLanguage(language.locale);
              }}
            >
              {language.name === activeLanguage?.name && (
                <LanguageButtonIndicator />
              )}
              {language.name}
            </LanguageButton>
          ))}
        </Container>
      </LanguagePopover>
    </>
  );
};

export default LanguageSelector;
