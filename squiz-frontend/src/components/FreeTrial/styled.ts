import styled from '@emotion/styled';
import { Star } from '@material-ui/icons';

export const FreeTrialWrapper = styled.div<{
  Background2x?: string;
  Background?: string;
}>`
  width: 100%;
  min-height: 100vh;
  background-position: top;
  background-repeat: no-repeat;
  transform: scale(1); 
  animation-duration: 20s; 
  animation-iteration-count: infinite;
  animation-timing-function: linear; 
  animation-direction: alternate;
  background-image: url('${props => props.Background2x}'); 
  background-size: cover;
  @media (max-width: 1280px) {
    background-image: url('${props => props.Background2x}');
    background-size: 100% auto;
  }
  @media (max-width: 960px) {
    background-image: url('${props => props.Background}');
    background-size: 100% auto;
  }
  @media (max-width: 600px) {
    background-image: url('${props => props.Background}');
    background-size: 100% auto;
  }
`;

export const InsightTimerLogo = styled.img`
  padding-top: 35px;
  padding-left: 45px;
  padding-right: 45px;
  padding-bottom: 1.25rem;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 960px) {
    position: absolute;
    padding-bottom: 2rem;
    margin: 0;
  }
`;

export const FreeTrialContainer = styled.div`
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 960px) {
    flex-direction: row;
    padding-top: 2rem;
  }
`;

export const OfferBlock = styled.div`
  --text-opacity: 1;
  color: rgba(255, 255, 255, var(--text-opacity));
  text-align: center;
  line-height: 1.25;
  align-items: flex-end;
  flex-direction: column;
  display: flex;
  @media (min-width: 960px) {
    flex: 1 1;
  }
`;

export const WebOfferTitle = styled.div`
  font-size: 52px;
  width: 100%;
  margin-bottom: 0.5rem;
  font-family: JennaSuePro;
  @media (min-width: 960px) {
    margin-bottom: 0;
  }
  @media (max-width: 600px) {
    font-size: 31px;
  }
`;

export const FreeTrialHeading = styled.h1`
  font-size: 74px;
  width: 100%;
  font-weight: 700;
  @media (max-width: 960px) {
    font-size: 52px;
  }
  @media (max-width: 600px) {
    font-size: 34px;
  }
`;

export const StarReviewBlock = styled.div`
  width: 100%;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  @media (min-width: 960px) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

export const ReviewStar = styled(Star)`
  width: 21px;
  height: 21px;
  margin-left: -1px;
  margin-bottom: 2px;
  @media (max-width: 960px) {
    width: 12px;
    height: 12px;
  }
`;

export const SubscriptionBlock = styled.div`
  width: 39%;
  justify-content: center;
  align-items: center;
  display: flex;
  @media (max-width: 1280px) {
    padding: 0;
    max-width: 520px;
  }
  @media (max-width: 960px) {
    max-width: 520px;
    width: 100%;
  }
`;

export const SubscriptionFormOuter = styled.div`
  width: 100%;
  max-width: 500px;
`;

export const MessageContainerDiv = styled.p`
  font-size: 0.875rem;
  color: #484848;
  text-align: center;
  opacity: 0.75;
  margin-bottom: 1rem;
`;

export const FormWrapper = styled.div`
  box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.2);
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  background-color: #fff;
  @media (min-width: 600px) {
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 4rem;
  }
`;

export const FormTitle = styled.h2`
  font-size: 34px;
  max-width: 380px;
  line-height: 1.09;
  letter-spacing: 0.3px;
  color: #181818;
  margin-bottom: 2rem;
  margin-top: 1rem;
  font-weight: 700;
  @media (max-width: 960px) {
    font-size: 24px;
    max-width: 300px;
    line-height: normal;
    letter-spacing: 0.21px;
  }
`;

export const TermsContainer = styled.div`
  font-size: 0.875rem;
  text-align: center;
  padding: 0 0.75rem;
  line-height: 1.375;
  color: #484848;
  a {
    font-weight: 700;
  }
  @media (min-width: 600px) {
    color: #fff;
  }
`;
