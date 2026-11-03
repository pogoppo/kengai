import { describe, it, expect } from 'vitest';
import { pathnameToArticleKey, toArticleKey } from './article';

describe('toArticleKey', () => {
	it('カテゴリとスラッグから記事キーを生成すること', () => {
		expect(toArticleKey({ category: 'rope-work', slug: 'bowline-knot' })).toBe(
			'rope-work/bowline-knot'
		);
	});
});

describe('pathnameToArticleKey', () => {
	it('記事ページのパスから記事キーを取り出すこと', () => {
		expect(pathnameToArticleKey('/article/rope-work/bowline-knot')).toBe('rope-work/bowline-knot');
	});
});
