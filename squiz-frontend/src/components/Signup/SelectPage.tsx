import { Trans } from '@lingui/macro';
import ErrorMessage from 'components/ErrorMessage';
import SignInWithApple from 'components/SignInWithApple';
import SignUpWithEmailButton from 'components/SignUpWithEmailButton';
import VerticalSpacing from 'components/VerticalSpacing';
import { usePageViewTracker } from 'context/PageViewTracker';
import { useGlobalStats } from 'hooks/useGlobalStats';
import { trackEvent } from 'lib/mparticle/trackEvents';
import { MParticleEventType } from 'lib/mparticle/types';
import numeral from 'numeral';
import React, { useState } from 'react';
import { SubTitle } from './styles';

type TProps = {
  onChangePage: (page: 'SELECT' | 'SIGNUP_EMAIL') => void;
};

const SelectPage: React.FC<TProps> = ({ onChangePage }) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const global = useGlobalStats();
  const { pageType } = usePageViewTracker();

  return (
    <>
      <SubTitle>
        <Trans>
          Create an account. It’s free. <br /> Join{' '}
          {(global.meditators &&
            numeral(global.meditators / 1000000).format('0')) ||
            13}{' '}
          million people today.
        </Trans>
      </SubTitle>

      <VerticalSpacing height={22} />

      <SignUpWithEmailButton
        disabled={loading}
        onClick={() => {
          trackEvent({
            event_name: 'registration_popup_create_account_interacted',
            event_type: MParticleEventType.Navigation,
            page_type: pageType,
            type: 'email'
          });
          onChangePage('SIGNUP_EMAIL');
        }}
      />

      <VerticalSpacing height={17} />

      <SignInWithApple
        signup
        disabled={loading}
        onComplete={(e?: string) => {
          setLoading(false);
          setError(e);
        }}
        onSubmit={() => {
          trackEvent({
            event_name: 'registration_popup_create_account_interacted',
            event_type: MParticleEventType.Navigation,
            page_type: pageType,
            type: 'apple'
          });
          setLoading(true);
        }}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

export default SelectPage;
