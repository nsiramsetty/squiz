import styled from '@emotion/styled';

/**
 * Section container for public website ( based on latest designs 2020 )
 * - can be used for Carousels and any other sections.
 */
const SectionTitle = styled.h3`
  font-weight: 700;
  font-size: 38px;
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export default SectionTitle;
