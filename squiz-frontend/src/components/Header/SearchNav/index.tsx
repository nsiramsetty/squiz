import SearchIcon from '@material-ui/icons/Search';
import SearchBar from 'components/SearchBar';
import { usePageViewTracker } from 'context/PageViewTracker';
import React, { useState } from 'react';
import { SearchButton, SearchPopover, StyledCloseIcon } from './styled';

const SearchNav: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { pageType } = usePageViewTracker();

  return (
    <>
      {showSearch && (
        <SearchPopover>
          <SearchBar
            pageType={pageType}
            autoFocus
            onClose={() => setShowSearch(false)}
            onSearchClick={() => setShowSearch(false)}
          />
          <SearchButton closebutton={1}>
            <StyledCloseIcon />
          </SearchButton>
        </SearchPopover>
      )}

      {!showSearch && (
        <SearchButton onClick={() => setShowSearch(!showSearch)}>
          <SearchIcon />
        </SearchButton>
      )}
    </>
  );
};

export default SearchNav;
