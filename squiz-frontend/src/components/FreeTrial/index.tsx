import { Trans } from '@lingui/macro';
import Container from '@material-ui/core/Container';
import Background2x from 'assets_2/images/freetrial/BG-min.jpg';
import Background from 'assets_2/images/freetrial/Bg-mobile@2x-min.jpg';
import InsightLogo from 'assets_2/images/freetrial/insighttimer.svg';
import VerticalSpacing from 'components/VerticalSpacing';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Elements, StripeProvider } from 'react-stripe-elements';
import FreeTrialMeta from './FreeTrialMeta';
import {
  FreeTrialContainer,
  FreeTrialHeading,
  FreeTrialWrapper,
  InsightTimerLogo,
  OfferBlock,
  ReviewStar,
  StarReviewBlock,
  SubscriptionBlock,
  SubscriptionFormOuter,
  WebOfferTitle
} from './styled';
import SubscriptionForm from './SubscriptionForm';

const FreeTrial: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const STRIPE_SCRIPT_URL = 'https://js.stripe.com/v3/';
  const i18n = useLinguiI18n();

  const title = i18n._('Insight Timer Premium: 30 Day Trial');
  const description = i18n._('Subscribe to MemberPlus on 30 Day Free Trial');

  const handleChangeClientState = (
    _newState: {},
    addedTags: { scriptTags: any[] }
  ) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        (src: { src: string }) => src.src === STRIPE_SCRIPT_URL
      );
      if (foundScript) {
        foundScript.addEventListener('load', () => setScriptLoaded(true), {
          once: true
        });
      }
    }
  };

  return (
    <>
      <Helmet onChangeClientState={handleChangeClientState}>
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
        <script src={STRIPE_SCRIPT_URL} />
      </Helmet>

      <FreeTrialMeta title={title} description={description} />

      <FreeTrialWrapper Background2x={Background2x} Background={Background}>
        <InsightTimerLogo src={InsightLogo} alt="insighttimer logo" />

        <Container maxWidth="xl" className="w-full py-0">
          <FreeTrialContainer>
            <OfferBlock>
              <WebOfferTitle>
                <Trans>Web Offer</Trans>
              </WebOfferTitle>
              <FreeTrialHeading>
                <Trans>
                  Start Your 30 Day <br /> Free Trial
                </Trans>
              </FreeTrialHeading>
              <StarReviewBlock>
                <Trans>350k</Trans>{' '}
                <span>
                  <ReviewStar />
                  <ReviewStar />
                  <ReviewStar />
                  <ReviewStar />
                  <ReviewStar />
                </span>{' '}
                <Trans>reviews</Trans>
              </StarReviewBlock>
              <VerticalSpacing height={24} />
            </OfferBlock>
            <SubscriptionBlock>
              <SubscriptionFormOuter>
                {scriptLoaded && (
                  <StripeProvider
                    apiKey={`${process.env.REACT_APP_STRIPE_PUBLIC_API_KEY}`}
                  >
                    <Elements>
                      <SubscriptionForm />
                    </Elements>
                  </StripeProvider>
                )}
              </SubscriptionFormOuter>
            </SubscriptionBlock>
          </FreeTrialContainer>
        </Container>
      </FreeTrialWrapper>
    </>
  );
};

export default FreeTrial;
