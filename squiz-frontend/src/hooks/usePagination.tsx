const getPagingUrl = (url: string, currentPage: number, maxPages?: number) => {
  if (currentPage < 0) return undefined;
  if (!maxPages) return undefined;
  if (maxPages && currentPage > maxPages) return undefined;
  if (currentPage && currentPage > 0) {
    return url + '/' + currentPage;
  }
  return url;
};

function usePagination(
  url: string,
  currentPage: number = 0,
  pageSize: number,
  totalLength?: number
) {
  // never set any negative page number urls
  const canonicalUrl = url + (currentPage > 0 ? `/${currentPage}` : '');

  const maxPages = totalLength && Math.ceil(totalLength / pageSize);

  const nextUrl = getPagingUrl(url, currentPage + 1, maxPages);

  const prevUrl = getPagingUrl(url, currentPage - 1, maxPages);

  var is404 = false;

  if (maxPages === 0) {
    is404 = true;
  }

  if (maxPages && currentPage >= maxPages) {
    is404 = true;
  }

  if (currentPage < 0) {
    is404 = true;
  }

  return {
    canonicalUrl,
    nextUrl,
    prevUrl,
    is404,
    maxPages
  };
}

export default usePagination;