import styled from '@emotion/styled';

/**
 * Section container for public website ( based on latest designs 2020 )
 * - can be used for sections.
 */
const SectionContainer = styled.section<{ variant?: 'small' | 'large' }>`
  max-width: ${props => (props.variant === 'small' ? '1600px' : '1800px')};
  margin: auto;
  width: 100%;
  padding-left: 64px;
  padding-right: 64px;
  @media (max-width: 1681px) {
    max-width: ${props => (props.variant === 'small' ? '1396px' : '1600px')};
    padding-left: 40px;
    padding-right: 40px;
  }
  @media (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
  }
`;

export default SectionContainer;
