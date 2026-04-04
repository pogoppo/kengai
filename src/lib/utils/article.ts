export function pathnameToArticleSlug(pathname: string): string {
	return pathname.split('/')[3] ?? '';
}
