import styled from '@emotion/styled';

/**
 * Section container for public website ( based on latest designs 2020 )
 * - can be used for sections.
 */
const StaggerWrapper = styled.div<{
  staggerOn: boolean;
  fadeInDelay: string;
}>`
  margin-top: ${props => (props.staggerOn ? '28px' : '0px')};

  @media (max-width: 768px) {
    margin-top: 0px;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translate(0, 50px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  @media (min-width: 960px) {
    opacity: 0;
    animation: fadeIn 1500ms cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-fill-mode: forwards;
    animation-delay: ${props => props.fadeInDelay};
  }
`;

export default StaggerWrapper;
