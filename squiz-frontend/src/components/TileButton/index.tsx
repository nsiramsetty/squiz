import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonContent, StyledButton, TileBackground } from './styled';

const TileButton: React.FC<{
  bgImage?: string;
  bgImageMobile?: string;
  border?: string;
  paddingtop: [string, string];
  to: string;
  disabled?: boolean;
  disableUp?: boolean;
  radius?: string;
}> = ({
  bgImage,
  bgImageMobile,
  children,
  paddingtop,
  to,
  border,
  disabled,
  disableUp,
  radius
}) => {
  const externalLink = to.startsWith('http') || undefined;
  const linkProps = (externalLink && { href: to }) || {
    to,
    component: Link
  };

  return (
    <StyledButton
      disabled={disabled}
      {...linkProps}
      paddingtop={paddingtop}
      disableup={disableUp ? 1 : 0}
      radius={radius}
      border={border}
    >
      <TileBackground
        className="group-background"
        bgImage={bgImage}
        bgImageMobile={bgImageMobile}
      />
      <ButtonContent>{children}</ButtonContent>
    </StyledButton>
  );
};

export default TileButton;
