export function createSearchURL(query: string) {
	const trimmedQuery = query.replace(/\s+/g, ' ').trim();
	const params = new URLSearchParams();
	if (trimmedQuery !== '') {
		params.set('q', trimmedQuery);
	}
	const uri = new URL(location.href);
	uri.pathname = '/search';
	uri.search = params.toString();
	return uri;
}
