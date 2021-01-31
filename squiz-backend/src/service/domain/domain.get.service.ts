import { ESDefaultClient } from '../../helper/axios.helper';
import { DOMAIN_SUMMARY } from '../../model/domain/domain.model';
import { SearchResultResponse } from '../../model/response/search-result.model';
import { Collection, ESIndex } from '../../shared/enum';
import encodeStringToMD5 from '../shared/crypto.service';
import { getDocumentByIDFromES } from '../shared/elastic.service';
import { getFirestoreDocById } from '../shared/firestore.service';

export default async function getDomain(id: string): Promise<SearchResultResponse> {
  let domainName = encodeStringToMD5(id);
  return getDocumentByIDFromES(domainName, ESIndex.EMAIL_DOMAIN, ESDefaultClient, DOMAIN_SUMMARY).catch(
    async (): Promise<SearchResultResponse> => {
      domainName = id.replace(/\./g, '__');
      return getFirestoreDocById(Collection.EMAIL_DOMAIN, domainName, DOMAIN_SUMMARY);
    },
  );
}
