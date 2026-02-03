export interface FaqItem {
	id: string;
	summary: string;
	content: string;
}

export interface FaqSection {
	id: string;
	title: string;
	items: FaqItem[];
}
