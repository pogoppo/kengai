import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getArticle, ArticleServiceError } from './article.server';
import { articleRepository } from '$lib/repositories/article';
import { readFile } from 'fs/promises';
import { marked } from 'marked';

// モックの定義
vi.mock('$lib/repositories/article');
vi.mock('fs/promises');
vi.mock('marked');

describe('getArticle', () => {
	const mockCategory = 'test-category';
	const mockSlug = 'test-slug';

	const mockArticle = {
		slug: mockSlug,
		title: 'Test Article',
		description: 'Test Description',
		date: '2023-01-01',
		tags: ['test'],
		category: mockCategory
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('記事が存在しファイルが有効な場合、記事データとHTMLコンテンツを返すこと', async () => {
		// Arrange
		vi.mocked(articleRepository.findBySlug).mockReturnValue(mockArticle);
		vi.mocked(readFile).mockResolvedValue(`---
title: Test
---
# Hello World`);
		vi.mocked(marked).mockResolvedValue('<h1>Hello World</h1>');

		// Act
		const result = await getArticle(mockCategory, mockSlug);

		// Assert
		expect(articleRepository.findBySlug).toHaveBeenCalledWith(mockSlug);
		expect(readFile).toHaveBeenCalled(); // パスの検証は複雑になるため省略または別途検証
		expect(marked).toHaveBeenCalledWith('# Hello World');
		expect(result).toEqual({
			articleSummary: mockArticle,
			content: '<h1>Hello World</h1>'
		});
	});

	it('リポジトリに記事が存在しない場合、NOT_FOUNDエラーを投げること', async () => {
		// Arrange
		vi.mocked(articleRepository.findBySlug).mockReturnValue(undefined);

		// Act & Assert
		await expect(getArticle(mockCategory, mockSlug)).rejects.toThrow(
			new ArticleServiceError('NOT_FOUND', 'Article not found')
		);
	});

	it('ファイルの読み込みに失敗した場合、INTERNAL_ERRORを投げること', async () => {
		// Arrange
		vi.mocked(articleRepository.findBySlug).mockReturnValue(mockArticle);
		vi.mocked(readFile).mockRejectedValue(new Error('File system error'));

		// Act & Assert
		await expect(getArticle(mockCategory, mockSlug)).rejects.toThrow(ArticleServiceError);

		await expect(getArticle(mockCategory, mockSlug)).rejects.toThrow(
			'Failed to load article content'
		);
	});
});
