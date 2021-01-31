import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

interface TProps {
  exists?: any;
  to?: any;
  filterName?: any;
}

const FilterLink: FC<TProps> = ({ exists, to, filterName }) => {
  return (
    <>
      {exists ? (
        <NavLink
          exact
          activeClassName="active"
          to={to}
          className="filter-link isAvailable"
        >
          {filterName}
        </NavLink>
      ) : (
        <span className="filter-link ">{filterName}</span>
      )}
    </>
  );
};
export default FilterLink;
