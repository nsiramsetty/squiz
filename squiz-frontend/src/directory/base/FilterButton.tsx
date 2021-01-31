import React, { FC } from 'react';
import FilterLink from 'directory/base/FilterLink';
import FilterButtonStyles from 'directory/base/FilterButtonStyles';

interface TProps {
  startwith?: any;
  filterKeys?: any;
  baseLink?: any;
}

const FilterButton: FC<TProps> = ({ startwith, filterKeys, baseLink }) => {
  return (
    <>
      <FilterButtonStyles>
        <h2>Browse by</h2>
        <div className="browser-wrap">
          <FilterLink exists={true} to={baseLink} filterName={'All'} />
          <FilterLink
            exists={filterKeys.includes('#')}
            to={`${baseLink}/hash`}
            filterName={'#'}
          />
          {new Array(26).fill(1).map((_, i) => {
            const alphabet = String.fromCharCode(97 + i);
            const isContain = filterKeys.includes(alphabet);
            return (
              <FilterLink
                exists={isContain}
                to={`${baseLink}/${alphabet}`}
                filterName={alphabet}
              />
            );
          })}
          <FilterLink
            exists={filterKeys.includes('other')}
            to={`${baseLink}/more`}
            filterName={'Other'}
          />
        </div>
      </FilterButtonStyles>
    </>
  );
};
export default FilterButton;
