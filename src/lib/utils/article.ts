export function pathnameToArticleSlug(pathname: string): string {
	return pathname.split('/').slice(2, 4).join('/');
}
