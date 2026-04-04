import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import ArticleList from './ArticleList.svelte';

describe('ArticleList', () => {
	const articles = [
		{
			slug: 'article-1',
			title: 'First Article',
			description: 'Description 1',
			category: 'cat1',
			tags: ['tag1', 'tag2']
		},
		{
			slug: 'article-2',
			title: 'Second Article',
			description: 'Description 2',
			category: 'cat2',
			tags: ['tag3']
		},
		{
			slug: 'article-3',
			title: 'Third Article',
			description: 'Description 3',
			category: 'cat1',
			tags: []
		}
	];

	describe('デフォルトモード（リンク表示）', () => {
		test('記事リストが正しく表示される', async () => {
			render(ArticleList, { articles });

			const list = page.getByRole('list');
			await expect.element(list).toBeInTheDocument();

			await expect.element(page.getByText('First Article')).toBeInTheDocument();
			await expect.element(page.getByText('Second Article')).toBeInTheDocument();
			await expect.element(page.getByText('Third Article')).toBeInTheDocument();
		});

		test('記事リンクが正しい属性で表示される', async () => {
			render(ArticleList, { articles });

			const firstLink = page.getByRole('link', { name: /First Article/ });
			await expect.element(firstLink).toBeInTheDocument();
			await expect.element(firstLink).toHaveAttribute('href', '/article/cat1/article-1');

			const secondLink = page.getByRole('link', { name: /Second Article/ });
			await expect.element(secondLink).toBeInTheDocument();
			await expect.element(secondLink).toHaveAttribute('href', '/article/cat2/article-2');
			const thirdLink = page.getByRole('link', { name: /Third Article/ });
			await expect.element(thirdLink).toBeInTheDocument();
			await expect.element(thirdLink).toHaveAttribute('href', '/article/cat1/article-3');
		});

		test('記事の説明文が表示される', async () => {
			render(ArticleList, { articles });

			await expect.element(page.getByText('Description 1')).toBeInTheDocument();
			await expect.element(page.getByText('Description 2')).toBeInTheDocument();
			await expect.element(page.getByText('Description 3')).toBeInTheDocument();
		});

		test('記事のタグが表示される', async () => {
			render(ArticleList, { articles });

			await expect.element(page.getByText(/#tag1 #tag2/)).toBeInTheDocument();
			await expect.element(page.getByText(/#tag3/)).toBeInTheDocument();
		});

		test('チェックボックスが表示されない', async () => {
			render(ArticleList, { articles });

			const checkboxes = page.getByRole('checkbox');
			const count = checkboxes.length;
			expect(count).toBe(0);
		});
	});

	describe('チェック可能モード（checkable=true）', () => {
		test('チェックボックス付きリストが表示される', async () => {
			render(ArticleList, { articles, checkable: true });

			const checkboxes = page.getByRole('checkbox');
			const count = checkboxes.length;
			expect(count).toBe(3);
		});

		test('リンクではなくラベルが表示される', async () => {
			render(ArticleList, { articles, checkable: true });

			const links = page.getByRole('link');
			const linkCount = links.length;
			expect(linkCount).toBe(0);

			await expect.element(page.getByText('First Article')).toBeInTheDocument();
			await expect.element(page.getByText('Second Article')).toBeInTheDocument();
			await expect.element(page.getByText('Third Article')).toBeInTheDocument();
		});

		test('チェックボックスをクリックするとcheckedArticlesに追加される', async () => {
			render(ArticleList, {
				articles,
				checkable: true
			});

			const checkboxes = page.getByRole('checkbox');
			const firstCheckbox = checkboxes.nth(0);

			// 初期状態でチェックされていない
			await expect.element(firstCheckbox).not.toBeChecked();

			await userEvent.click(firstCheckbox, { force: true });

			// クリック後にチェックされる
			// `checked={checkedArticles.has(article.slug)}`なので暫定対応
			await expect.element(firstCheckbox).toBeChecked();
		});

		test('チェック済みの記事を再度クリックするとcheckedArticlesから削除される', async () => {
			render(ArticleList, {
				articles,
				checkable: true,
				checkedArticles: new Set<string>(['article-1'])
			});

			const checkboxes = page.getByRole('checkbox');
			const firstCheckbox = checkboxes.nth(0);

			// 初期状態でチェック済み
			await expect.element(firstCheckbox).toBeChecked();

			await userEvent.click(firstCheckbox, { force: true });

			// クリック後にチェックが外れる
			// `checked={checkedArticles.has(article.slug)}`なので暫定対応
			await expect.element(firstCheckbox).not.toBeChecked();
		});

		test('複数の記事をチェックできる', async () => {
			render(ArticleList, {
				articles,
				checkable: true
			});

			const checkboxes = page.getByRole('checkbox');
			const firstCheckbox = checkboxes.nth(0);
			const secondCheckbox = checkboxes.nth(1);
			const thirdCheckbox = checkboxes.nth(2);

			// 初期状態で全てチェックされていない
			await expect.element(firstCheckbox).not.toBeChecked();
			await expect.element(secondCheckbox).not.toBeChecked();
			await expect.element(thirdCheckbox).not.toBeChecked();

			await userEvent.click(firstCheckbox, { force: true });
			await userEvent.click(secondCheckbox, { force: true });
			await userEvent.click(thirdCheckbox, { force: true });

			// クリック後に全てチェックされる
			await expect.element(firstCheckbox).toBeChecked();
			await expect.element(secondCheckbox).toBeChecked();
			await expect.element(thirdCheckbox).toBeChecked();
		});

		test('checkedArticlesの初期値が反映される', async () => {
			const checkedArticles = new Set<string>(['article-2', 'article-3']);
			render(ArticleList, {
				articles,
				checkable: true,
				checkedArticles
			});

			const checkboxes = page.getByRole('checkbox');
			const firstCheckbox = checkboxes.nth(0);
			const secondCheckbox = checkboxes.nth(1);
			const thirdCheckbox = checkboxes.nth(2);

			await expect.element(firstCheckbox).not.toBeChecked();
			await expect.element(secondCheckbox).toBeChecked();
			await expect.element(thirdCheckbox).toBeChecked();
		});

		test('チェックボックスモードでも記事の説明文とタグが表示される', async () => {
			render(ArticleList, { articles, checkable: true });

			await expect.element(page.getByText('Description 1')).toBeInTheDocument();
			await expect.element(page.getByText(/#tag1 #tag2/)).toBeInTheDocument();
			await expect.element(page.getByText(/#tag3/)).toBeInTheDocument();
		});
	});

	describe('空の記事リスト', () => {
		test('記事がない場合はメッセージが表示される', async () => {
			render(ArticleList, { articles: [] });
			await expect.element(page.getByText('記事が見つかりませんでした。')).toBeInTheDocument();
		});

		test('記事がない場合はリストが表示されない', async () => {
			render(ArticleList, { articles: [] });

			const lists = page.getByRole('list');
			const count = lists.length;
			expect(count).toBe(0);
		});

		test('checkable=trueでも記事がない場合はメッセージが表示される', async () => {
			render(ArticleList, { articles: [], checkable: true });
			await expect.element(page.getByText('記事が見つかりませんでした。')).toBeInTheDocument();
		});
	});

	describe('タグ表示', () => {
		test('タグがない記事ではタグテキストが空になる', async () => {
			const articlesWithoutTags = [
				{
					slug: 'cat1/no-tags',
					title: 'No Tags Article',
					description: 'No tags here',
					category: 'cat1',
					tags: []
				}
			];

			const { container } = render(ArticleList, { articles: articlesWithoutTags });

			const tagText = container.querySelector('tag-text');
			expect(tagText?.textContent?.trim()).toBe('');
		});

		test('単一のタグが正しく表示される', async () => {
			const articlesWithSingleTag = [
				{
					slug: 'cat1/single-tag',
					title: 'Single Tag Article',
					description: 'One tag',
					category: 'cat1',
					tags: ['solo']
				}
			];

			render(ArticleList, { articles: articlesWithSingleTag });

			await expect.element(page.getByText('#solo')).toBeInTheDocument();
		});
	});
});
