export function createSearchURL(query: string) {
  const params = new URLSearchParams();
  if (query && query.trim() !== '') {
    params.set('q', query.trim());
  }
  const uri = new URL(location.href);
  uri.pathname = '/search';
  uri.search = params.toString();
  return uri;
}
