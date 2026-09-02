import { describe, it, expect } from 'vitest';
import {
	articleSchema,
	breadcrumbSchema,
	collectionPageSchema,
	faqSchema,
	stripHtml
} from './structured-data';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { ArticleSummary } from '$lib/types/article';

const SITE_URL = PUBLIC_SITE_URL.replace(/\/+$/, '');

const article: ArticleSummary = {
	slug: 'bowline-knot',
	title: 'もやい結び (Bowline Knot)',
	description: 'ロープの端に輪を作る時に使われる汎用的な結びです。',
	category: 'rope-work',
	tags: ['ロープワーク基礎', '登山'],
	thumbnail: '/images/articles/rope-work/bowline-knot/first.webp',
	date: '2026-02-13',
	updated: '2026-09-02'
};

describe('stripHtml', () => {
	it('HTMLタグを除去してプレーンテキストにする', () => {
		const text = stripHtml("説明です。<br/><button onClick='window.foo()'>解除する</button>");

		expect(text).toBe('説明です。 解除する');
	});

	it('HTMLエンティティをデコードする', () => {
		expect(stripHtml('a &amp; b &quot;c&quot;')).toBe('a & b "c"');
	});
});

describe('breadcrumbSchema', () => {
	it('positionが1始まりでURLが絶対化される', () => {
		const schema = breadcrumbSchema([
			{ label: 'KENGAI', href: '/' },
			{ label: 'ロープワーク', href: '/category/rope-work' }
		]);

		expect(schema.itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'KENGAI', item: `${SITE_URL}/` },
			{
				'@type': 'ListItem',
				position: 2,
				name: 'ロープワーク',
				item: `${SITE_URL}/category/rope-work`
			}
		]);
	});

	it('hrefのない項目はitemを持たない', () => {
		const schema = breadcrumbSchema([{ label: '現在地' }]);
		const [item] = schema.itemListElement as Record<string, unknown>[];

		expect(item).not.toHaveProperty('item');
	});
});

describe('articleSchema', () => {
	const path = '/article/rope-work/bowline-knot';

	it('Articleとして必要な情報を絶対URLで出力する', () => {
		const schema = articleSchema(article, { path });

		expect(schema['@type']).toBe('Article');
		expect(schema.headline).toBe(article.title);
		expect(schema.url).toBe(`${SITE_URL}${path}`);
		expect(schema.image).toBe(`${SITE_URL}${article.thumbnail}`);
		expect(schema.datePublished).toBe('2026-02-13');
		expect(schema.dateModified).toBe('2026-09-02');
		expect(schema.keywords).toEqual(article.tags);
	});

	it('日付が未設定の記事では日付プロパティを省略する', () => {
		const schema = articleSchema({ ...article, date: undefined, updated: undefined }, { path });

		expect(schema).not.toHaveProperty('datePublished');
		expect(schema).not.toHaveProperty('dateModified');
	});

	it('サムネイルがない記事では既定のOG画像を使う', () => {
		const schema = articleSchema({ ...article, thumbnail: undefined }, { path });

		expect(schema.image).toBe(`${SITE_URL}/images/app/og-default.webp`);
	});
});

describe('collectionPageSchema', () => {
	it('記事一覧をItemListとして出力する', () => {
		const schema = collectionPageSchema({
			name: 'ロープワーク',
			description: '一覧です。',
			path: '/category/rope-work',
			articles: [article]
		});
		const mainEntity = schema.mainEntity as Record<string, unknown>;

		expect(schema['@type']).toBe('CollectionPage');
		expect(mainEntity.numberOfItems).toBe(1);
		expect(mainEntity.itemListElement).toEqual([
			{
				'@type': 'ListItem',
				position: 1,
				name: article.title,
				url: `${SITE_URL}/article/rope-work/bowline-knot`
			}
		]);
	});
});

describe('faqSchema', () => {
	it('全セクションの質問をフラットにし、回答からHTMLを除去する', () => {
		const schema = faqSchema([
			{
				id: 'app',
				title: 'アプリに関して',
				items: [{ id: 'q1', summary: 'これは何ですか？', content: 'アプリ<br/>です。' }]
			},
			{
				id: 'other',
				title: 'その他',
				items: [{ id: 'q2', summary: '質問2', content: '<a href="#q1">回答2</a>' }]
			}
		]);
		const mainEntity = schema.mainEntity as Record<string, unknown>[];

		expect(mainEntity).toHaveLength(2);
		expect(mainEntity[0]).toEqual({
			'@type': 'Question',
			name: 'これは何ですか？',
			acceptedAnswer: { '@type': 'Answer', text: 'アプリ です。' }
		});
		expect((mainEntity[1].acceptedAnswer as Record<string, unknown>).text).toBe('回答2');
	});
});
