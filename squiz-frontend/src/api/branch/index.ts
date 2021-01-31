/* eslint-disable no-console  */
import branch, { SessionData } from 'branch-sdk';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

let initialized = false;

type TBranchDataCallback = (data: SessionData | null) => void;

type TPageViewData = Record<string, unknown>;

export function init(cb: TBranchDataCallback) {
  initialized = true;

  if (!process.env.REACT_APP_BRANCH_API_KEY) {
    return console.warn('branch.init: INVALID KEY');
  }

  return branch.init(
    process.env.REACT_APP_BRANCH_API_KEY,
    {},
    (error, branchData) => {
      if (error) {
        console.warn('branch.init: ERROR', error);
      }
      cb(branchData);
    }
  );
}

export function link(
  linkData: branch.DeepLinkData,
  cb: (error: branch.BranchError, link: branch.BranchError) => void
) {
  if (!initialized) {
    init(() => {
      branch.link(linkData, cb);
    });
  } else {
    branch.link(linkData, cb);
  }
}

export function getBranchLinkData(cb: TBranchDataCallback) {
  return branch.data((error, branchData) => {
    if (error != null) {
      console.warn('branch.data: ERROR', error);
    }
    cb(branchData);
  });
}

export function setBranchViewData(data: TPageViewData) {
  try {
    if (data && !isEmpty(data)) {
      console.info(`branch.setBranchViewData: ${Object.keys(data)}`);
      branch.setBranchViewData({ data });
    }
  } catch (err) {
    console.warn('branch.setBranchViewData: ERROR', err);
  }
}

export function trackPageView() {
  try {
    if (branch) {
      branch.track('pageview');
    }
  } catch (err) {
    console.warn('branch.trackPageView: ERROR', err);
  }
}

export const saveUTMs = (location: Location, data: SessionData | null) => {
  const data_parsed: Record<string, unknown> | undefined = data?.data_parsed;
  const queries = queryString.parse(location.search);
  const utmData: Record<string, unknown> = {};
  // only store relevant utm values (if present)
  if (data_parsed && !isEmpty(data_parsed)) {
    // save utms from branch
    if (data_parsed['~campaign'])
      utmData.utm_campaign = data_parsed['~campaign'];
    if (data_parsed['~channel']) utmData.utm_source = data_parsed['~channel'];
    if (data_parsed['~feature']) utmData.utm_medium = data_parsed['~feature'];

    if (data_parsed['$sharer_user_id'])
      utmData['$sharer_user_id'] = data_parsed['$sharer_user_id'];
    if (data_parsed['$share_link_id'])
      utmData['$share_link_id'] = data_parsed['$share_link_id'];
    if (data_parsed['$share_created_date'])
      utmData['$share_created_date'] = data_parsed['$share_created_date'];
  } else if (queries) {
    // save utms from query parameters
    if (queries['utm_source']) utmData['utm_source'] = queries['utm_source'];
    if (queries['utm_medium']) utmData['utm_medium'] = queries['utm_medium'];
    if (queries['utm_campaign'])
      utmData['utm_campaign'] = queries['utm_campaign'];
    if (queries['utm_content']) utmData['utm_content'] = queries['utm_content'];
    if (queries['utm_term']) utmData['utm_term'] = queries['utm_term'];
  }

  if (!isEmpty(data)) {
    const utmDataJson = JSON.stringify(utmData);
    // only set the data if there is any present
    localStorage.setItem('IT-branchAttributionData', utmDataJson);
    console.info('branch.saveUTM', 'IT-branchAttributionData', utmDataJson);
  }
};

/**
 * clear local storage timestamps so we can reshow the journey on the same url types
 */
export const clearLocalStorageDismissal = () => {
  try {
    const savedBranchData = localStorage.getItem(
      'BRANCH_WEBSDK_KEYjourneyDismissals'
    );

    const dismissals = savedBranchData && JSON.parse(savedBranchData);

    if (dismissals && dismissals['5ce789a947e87c3451981d86']) {
      delete dismissals['5ce789a947e87c3451981d86'];
      localStorage.setItem(
        'BRANCH_WEBSDK_KEYjourneyDismissals',
        JSON.stringify(dismissals)
      );
    } else if (dismissals && dismissals['5cdcfface9007205bbcbec16']) {
      delete dismissals['5cdcfface9007205bbcbec16'];
      localStorage.setItem(
        'BRANCH_WEBSDK_KEYjourneyDismissals',
        JSON.stringify(dismissals)
      );
    }
  } catch (error) {
    console.warn(error);
  }
};

const searchEngines = [
  '360.cn',
  'alice.com',
  'aliceadsl.fr',
  'alltheweb.com',
  'altavista.com',
  'aol.com',
  'ask.com',
  'search.aol.fr',
  'alicesuche.aol.de',
  'search.auone.jp',
  'isearch.avg.com',
  'search.babylon.com',
  'baidu.com',
  'biglobe.ne.jp',
  'bing.com',
  'search.centrum.cz',
  'search.comcast.net',
  'search.conduit.com',
  'daum.net',
  'ekolay.net',
  'eniro.se',
  'go.mail.ru',
  'goo.ne.jp',
  'search.incredimail.com',
  'kvasir.no',
  'bing.com',
  'lycos.com',
  'search.lycos.de',
  'mamma.com',
  'msn.com',
  'money.msn.com',
  'local.msn.com',
  'mynet.com',
  'najdi.si',
  'naver.com',
  'search.netscape.com',
  'szukaj.onet.pl',
  'ozu.es',
  'rakuten.co.jp',
  'rambler.ru',
  'search-results.com',
  'search.smt.docomo.ne.jp',
  'sesam.no',
  'seznam.cz',
  'sogou.com',
  'szukacz.pl',
  'buscador.terra.com.br',
  'search.tut.by',
  'search.ukr.net',
  'search.virgilio.it',
  'voila.fr',
  'wp.pl',
  'yahoo.com',
  'yahoo.cn',
  'yahoo.com',
  'google.com',
  'yandex.com',
  'yandex.ru',
  'yam.com'
];

const getReferrer = () => {
  const a = document.createElement('a');
  a.href = document.referrer;

  let domain = a.hostname;
  let medium = 'referral';

  if (domain.startsWith('m.')) {
    domain = domain.replace(/^m\./, '');
  } else {
    domain = domain.replace(/^www\./, '');
  }

  if (domain.startsWith('insighttimer.com')) {
    domain = '(direct)';
    medium = '(none)';
  } else if (domain.startsWith('google.')) {
    domain = 'google';
    medium = 'organic';
  } else if (domain.startsWith('yahoo.')) {
    domain = 'yahoo';
    medium = 'organic';
  } else if (domain.startsWith('bing.')) {
    domain = 'bing';
    medium = 'organic';
  } else if (domain.startsWith('duckduckgo.')) {
    domain = 'duckduckgo';
    medium = 'organic';
  } else if (searchEngines.includes(domain)) {
    medium = 'organic';
  }

  return {
    domain,
    medium
  };
};

export const analyticsQuery = (tag: string) => {
  const savedBranchData = localStorage.getItem('IT-branchAttributionData');

  const branchData = savedBranchData && JSON.parse(savedBranchData);

  const data: Record<string, string | number> = {};
  const referrer = getReferrer();

  data['~channel'] = (branchData && branchData.utm_source) || referrer.domain;
  data['~feature'] = (branchData && branchData.utm_medium) || referrer.medium;

  if (branchData && branchData.utm_campaign)
    data['~campaign'] = branchData.utm_campaign;

  if (branchData && branchData.utm_content)
    data['~keyword'] = branchData.utm_content;

  if (branchData && branchData.utm_term) data.tags = branchData.utm_term;

  // add ab test tag
  const abTestBranchTag = sessionStorage.getItem('abtest_branch_tag');

  return (
    queryString.stringify(data) +
    (tag ? `&tags=${tag}` : '') +
    (abTestBranchTag ? `&tags=${abTestBranchTag}` : '')
  );
};
