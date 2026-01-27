import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import ArticleList from './ArticleList.svelte';

describe('ArticleList', () => {
	const articles = [
		{ slug: 'article-1', title: 'First Article', description: 'Description 1', category: 'cat1', tags: [] },
		{ slug: 'article-2', title: 'Second Article', description: 'Description 2', category: 'cat2', tags: [] }
	];

	test('記事リストが正しく表示される', async () => {
		render(ArticleList, { articles });

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		await expect.element(page.getByText('First Article')).toBeInTheDocument();
		await expect.element(page.getByText('Second Article')).toBeInTheDocument();
	});

	test('記事リンクが正しい属性で表示される', async () => {
		render(ArticleList, { articles });

		const firstLink = page.getByRole('link', { name: 'First Article' });
		await expect.element(firstLink).toBeInTheDocument();
		await expect.element(firstLink).toHaveAttribute('href', '/article/article-1');
		await expect.element(page.getByText('Description 1')).toBeInTheDocument();

		const secondLink = page.getByRole('link', { name: 'Second Article' });
		await expect.element(secondLink).toBeInTheDocument();
		await expect.element(secondLink).toHaveAttribute('href', '/article/article-2');
		await expect.element(page.getByText('Description 2')).toBeInTheDocument();
	});

	test('記事がない場合はメッセージが表示される', async () => {
		render(ArticleList, { articles: [] });
		await expect.element(page.getByText('記事が見つかりませんでした。')).toBeInTheDocument();
	});
});
