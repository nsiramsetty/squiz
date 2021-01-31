import { BranchEventProperties } from 'api/branch/types';
import { PageTypes } from 'lib/mparticle/enums';
import { MParticleEventProperties } from 'lib/mparticle/types';

export interface State {
  eventSent: boolean;
  pageData?: MParticleEventProperties;
  branchData?: BranchEventProperties;
  pageType: PageTypes;
  deepLink?: string;
}

export const initialState: State = {
  eventSent: false,
  pageType: PageTypes.Unknown
};

export type Action =
  | {
      type: 'TRACK_PAGE_VIEW';
      pageType: PageTypes;
      pageData: MParticleEventProperties;
      branchData?: BranchEventProperties;
      deepLink?: string;
      isSendEvent: boolean;
    }
  | { type: 'EVENT_SENT' }
  | { type: 'PAGE_CHANGED' };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'TRACK_PAGE_VIEW':
      return {
        pageType: action.pageType,
        pageData: action.pageData,
        branchData: action.branchData,
        deepLink: action.deepLink,
        eventSent: state.eventSent || (action.isSendEvent ? false : true)
      };
    case 'EVENT_SENT':
      return {
        ...state,
        eventSent: true
      };
    case 'PAGE_CHANGED':
      return initialState;
    default:
      return state;
  }
}
