import Header from 'components/Header';
import { HeaderContainer } from 'components/Header/styled';
import HeaderIntl from 'components/HeaderIntl';
import Notification from 'components/Notification';
import VerticalSpacing from 'components/VerticalSpacing';
import CookieBar from 'components_2/banners/CookieBar';
import ZendeskWidget from 'components_2/base/ZendeskWidget';
import { useNotification } from 'hooks/useNotification';
import noop from 'lodash/noop';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useScrollPosition } from './useScrollPosition';

interface ProviderProps {
  intlHeader?: boolean;
}

export const HeaderComponentContext = React.createContext<{
  initialHeight: number;
  scrolledHeight: number;
  transparentHeader: boolean;
  hideShadow: () => void;
  setTransparentHeader: (value: boolean) => void;
}>({
  initialHeight: 0,
  scrolledHeight: 0,
  transparentHeader: false,
  hideShadow: noop,
  setTransparentHeader: noop
});

export const HeaderProvider: React.FC<ProviderProps> = ({
  children,
  intlHeader
}) => {
  const [initialHeight, setInitialHeight] = useState(0);
  const [scrolledHeight, setScrolledHeight] = useState(0);
  const [hideShadow, setHideShadow] = useState(false);
  const [transparent, setTransparent] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const { id } = useNotification();
  const { scroll80 } = useScrollPosition();

  const handleHideShadow = useCallback(() => setHideShadow(true), []);
  const handleSetTransparent = useCallback(
    (value: boolean) => setTransparent(value),
    []
  );

  const handleHeaderScrolled = () => {
    setTimeout(
      () => setScrolledHeight(headerRef.current?.clientHeight || 0),
      300
    );
  };

  useEffect(() => {
    setTimeout(
      () => setInitialHeight(headerRef.current?.clientHeight || 0),
      10
    );
  }, [id]);

  return (
    <HeaderComponentContext.Provider
      value={{
        initialHeight,
        scrolledHeight,
        transparentHeader: transparent && !scroll80,
        hideShadow: handleHideShadow,
        setTransparentHeader: handleSetTransparent
      }}
    >
      <HeaderContainer id="site-header" ref={headerRef}>
        <Notification />

        {intlHeader != null && (
          <HeaderIntl
            hideShadow={hideShadow}
            onScrolled={handleHeaderScrolled}
          />
        )}

        {intlHeader == null && (
          <Header hideShadow={hideShadow} onScrolled={handleHeaderScrolled} />
        )}
      </HeaderContainer>

      {!transparent && <VerticalSpacing height={initialHeight} />}
      {children}
      <CookieBar />
      <ZendeskWidget />
    </HeaderComponentContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderComponentContext);
