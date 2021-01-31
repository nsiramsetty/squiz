import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import DirectorylistItemStyles from 'directory/base/DirectorylistItemStyles';

interface TProps {
  linkTo?: any;
  title?: any;
}

const ListItems: FC<TProps> = ({ linkTo, title }) => {
  return (
    <>
      <DirectorylistItemStyles>
        <NavLink to={linkTo}>
          <FormattedMessage id={title} defaultMessage={title} />
        </NavLink>
      </DirectorylistItemStyles>
    </>
  );
};
export default ListItems;
