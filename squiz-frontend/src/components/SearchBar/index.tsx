import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { useTaxonomy } from 'hooks/useTaxonomy';
import { LooseObject } from 'lib/models';
import {
  PageFields,
  PageTypes,
  SearchEventNames,
  SearchFields
} from 'lib/mparticle/enums';
import { logSearchEvent } from 'lib/mparticle/loggers';
import { Locales } from 'locales/i18nLingui';
import React, { ChangeEvent, useState } from 'react';
import ReactGA from 'react-ga';
import { SearchApi, SearchResponse } from 'services/search/api';
import SearchResultItem from './SearchResultItem';
import DefaultSearchResults from './SearchResultItem/default';
import {
  StyledContainer,
  StyledIcon,
  StyledInput,
  StyledLoader,
  StyledPaper,
  StyledScrollbars
} from './styled';

const searchApi = new SearchApi();

interface TProps {
  autoFocus?: boolean;
  pageType?: PageTypes;
  onClose?: () => void;
  onSearchClick?: () => void;
}

const SearchBar: React.FC<TProps> = ({
  autoFocus,
  onClose,
  onSearchClick,
  pageType
}) => {
  const i18n = useLinguiI18n();
  const taxonomy = useTaxonomy();
  const [loading, setLoading] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<LooseObject[] | null>(
    i18n.language === Locales.English ? DefaultSearchResults : null
  );

  const SearchWhitelist = ['PEOPLE', 'LIBRARY_ITEMS', 'COURSES', 'HASHTAGS'];

  const handleSearchInitiated = () => {
    setInitiated(true);
    logSearchEvent(SearchEventNames.SearchInitiated, {
      [PageFields.PageType]: pageType || PageTypes.Unknown
    });
  };

  const handleSearchSubmit = (searchTerm: string) => {
    logSearchEvent(SearchEventNames.SearchResult, {
      [PageFields.PageType]: pageType || PageTypes.Unknown,
      [SearchFields.SearchTerm]: searchTerm
    });
  };

  const handleSearchClose = () => {
    if (initiated) {
      logSearchEvent(SearchEventNames.SearchClose, {
        [PageFields.PageType]: pageType || PageTypes.Unknown
      });
      setInitiated(false);
    }

    setShowResults(false);
    if (onClose) onClose();
  };

  const handleSearchQuery = (value: string) => {
    setLoading(true);
    if (value.length > 0) {
      ReactGA.pageview(`/search_results.php?q=${value}`);
      searchApi
        .getSearchItems(value, 30, 0, taxonomy.config.deviceLang)
        .then((resp: SearchResponse) => {
          setLoading(false);
          setSearchResults(
            resp.data.filter((searchItem: LooseObject) =>
              SearchWhitelist.includes(searchItem.search_result_type)
            )
          );
          setShowResults(true);
        });
      handleSearchSubmit(value);
    } else {
      setLoading(false);
      setSearchResults(DefaultSearchResults);
    }
  };

  const [debouncedFunction] = useDebouncedCallback(handleSearchQuery, 1000);

  const inputhandler = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedFunction(e.target.value);
  };

  return (
    <ClickAwayListener onClickAway={() => handleSearchClose()}>
      <StyledContainer>
        <StyledPaper>
          {loading ? <StyledLoader /> : <StyledIcon />}

          <StyledInput
            value={searchQuery}
            readOnly={loading}
            placeholder={i18n._('Search')}
            autoFocus={autoFocus}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
              inputhandler(e);
            }}
            onFocus={() => {
              handleSearchInitiated();
              /* eslint no-unused-expressions: [0, { allowShortCircuit: true }] */
              i18n.language === Locales.English && setShowResults(true);
            }}
            onKeyDown={e => {
              return e.keyCode !== 13;
            }}
          />
        </StyledPaper>

        {showResults && (
          <StyledScrollbars>
            {searchResults &&
              searchResults.map((listItem: LooseObject) => (
                <SearchResultItem
                  key={`search_${listItem.id}`}
                  data={listItem}
                  onClick={() => onSearchClick && onSearchClick()}
                  pageType={pageType}
                  searchQuery={searchQuery}
                />
              ))}
          </StyledScrollbars>
        )}
      </StyledContainer>
    </ClickAwayListener>
  );
};

export default SearchBar;
