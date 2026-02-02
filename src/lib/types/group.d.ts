import type { ArticleSummary } from './article';

export interface Group {
	slug: string;
	label: string;
	description: string;
	image: string;
	sections: Array<{
		category: string;
		articles: { slug: string }[];
	}>;
}

export interface GroupWithArticles extends Omit<Group, 'sections'> {
	sections: Array<{
		category: string;
		articles: ArticleSummary[];
	}>;
}
