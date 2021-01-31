import { GlobalStatsProvider } from 'hooks/useGlobalStats';
import React from 'react';
import ActiveGlobe from '.';
import FlatEarth from './flatEarth';

export const activeGlobe = (props: any) => {
  return (
    <div style={{ width: '100%', height: '400vh' }}>
      <div style={{ width: '100%', position: 'fixed' }}>
        <ActiveGlobe lat={48.8} lon={2.3} name="city" />
      </div>
    </div>
  );
};

export const flatEarth = (props: any) => {
  return (
    <div style={{ width: '100%', height: '400vh' }}>
      <div style={{ width: '100%', position: 'fixed' }}>
        <FlatEarth />
      </div>
    </div>
  );
};

export const spinningGlobe = (props: any) => {
  return (
    <GlobalStatsProvider>
    <div style={{ width: '100%', height: '400vh' }}>
      <div style={{ width: '100%', position: 'fixed' }}>
        
      </div>
    </div>
    </GlobalStatsProvider>
  );
};

// export const spinning = (props: any) => {
//   return (
//     <div style={{ width: '50%', height: '1000px' }}>
//       <SpinningGlobe lat={0} lon={0} name="city"/>
//     </div>
//   );
// };

export default { title: 'ActiveGlobe' };
