import styled from '@emotion/styled';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { FunctionComponent } from 'react';
import { truncateText } from 'services/utils/text';

type TProps = {
  title?: string;
};

const StyledText = styled.div`
  font-size: 24px !important;
  font-family: ProximaNova;
  font-weight: 700;
  line-height: 1.25;
  @media (max-width: 600px) {
    font-size: '20px !important';
  }
`;

const TruncatedTitle: FunctionComponent<TProps> = ({ title }) => {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), {
    noSsr: true
  });

  return <StyledText>{truncateText(title, 1, sm ? 30 : 40)[0]}</StyledText>;
};

export default TruncatedTitle;
