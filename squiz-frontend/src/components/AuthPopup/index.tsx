import BackIconButton from 'components/BackIconButton';
import Signin from 'components/Signin';
import Signup from 'components/Signup';
import React, { useState } from 'react';
import { ReactComponent as CloseIcon } from './CloseIcon.svg';
import { CenterDiv, CloseWrapper, Popup } from './styled';

interface Props {
  startScreen?: 'login' | 'signup';
  onClose?: () => void;
  showBackIcon?: boolean;
  centered?: boolean;
}

const AuthPopup: React.FC<Props> = ({
  onClose,
  startScreen,
  showBackIcon,
  centered = false
}) => {
  const [screen, setScreen] = useState<'login' | 'signup'>(
    startScreen || 'login'
  );

  return (
    <Popup>
      <div className="spacing" style={{ height: '20px' }} />

      {onClose && (
        <CloseWrapper>
          <CloseIcon onClick={() => onClose()} />
        </CloseWrapper>
      )}

      <CenterDiv centered={centered}>
        {screen === 'login' ? (
          <>
            {showBackIcon && (
              <>
                <BackIconButton
                  onClick={() => {
                    setScreen('signup');
                  }}
                />
                <div className="spacing" style={{ height: '20px' }} />
              </>
            )}
            <Signin onSwitchSignUp={() => setScreen('signup')} />
          </>
        ) : (
          <Signup
            onSwitchSignIn={() => setScreen('login')}
            showBackIcon={showBackIcon}
          />
        )}
      </CenterDiv>
    </Popup>
  );
};

export default AuthPopup;
