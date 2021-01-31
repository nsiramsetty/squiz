import ErrorMessage from 'components/ErrorMessage';
import VerticalSpacing from 'components/VerticalSpacing';
import { usePageViewTracker } from 'context/PageViewTracker';
import { getMobileOperatingSystem } from 'helpers/utils';
import { useForm } from 'hooks/useForm';
import { logTextAppClicked } from 'lib/mparticle/loggers';
import React, { useState } from 'react';
import { FormLabel, InputText, StyledForm, TermsContainer } from './styled';
import SubmitButton from './SubmitButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const branch = require('branch-sdk');

interface Props {
  title?: string;
  description?: string;
  imageURL?: string;
}

const TextMeApp: React.FC<Props> = ({ title, description, imageURL }) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { currentInputs, handleInputChanges } = useForm({
    phone: ''
  });
  const { phone } = currentInputs;

  const { pageType, deepLink } = usePageViewTracker();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    setSubmitting(true);
    setError('');

    const handleResponse = (err: string) => {
      if (err) {
        setError('Invalid phone number');
      } else {
        setSuccess(true);
        const platform = getMobileOperatingSystem();
        logTextAppClicked(platform, pageType, 'Get the app');
      }
      setSubmitting(false);
    };
    const linkData = {
      channel: 'Website',
      data: {
        $deeplink: deepLink,
        $deeplink_v2: deepLink,
        $og_title: title,
        $og_description: description,
        $og_image_url: imageURL
      }
    };
    branch.sendSMS(phone, linkData, {}, handleResponse);
  };

  const submitButtonText = success ? 'SMS Sent!' : 'Get the app';

  return (
    <>
      <StyledForm onSubmit={handleSubmit} autoComplete="off">
        <FormLabel>Enter your mobile number to get our app:</FormLabel>
        <VerticalSpacing height={10} />
        <InputText
          name="phone"
          disabled={submitting || success}
          placeholder="(+61) 123 456 789"
          onChange={handleInputChanges}
          value={phone}
          autoFocus
        />
        <VerticalSpacing height={15} />
        <SubmitButton isSubmitting={submitting} disabled={success}>
          {submitButtonText}
        </SubmitButton>
        <VerticalSpacing height={20} />
        <TermsContainer>
          By providing your phone number, you agree to receive a one-time
          automated text message with a link to get the app. Standard messaging
          rates may apply.
        </TermsContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </StyledForm>
    </>
  );
};

export default TextMeApp;
