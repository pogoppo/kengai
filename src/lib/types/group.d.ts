import type { Article } from './article';

export interface GroupSummary {
  slug: string;
  label: string;
  description: string;
  image: string;
}

export interface GroupDetail extends GroupSummary {
  sections: Array<{
    category: string;
    articles: Article[];
  }>;
}
