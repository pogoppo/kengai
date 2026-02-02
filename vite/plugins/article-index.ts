import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Plugin } from 'vite';

interface ArticleBase {
	title: string;
	description: string;
	tags: string[];
}

interface ArticleIndex extends ArticleBase {
	slug: string;
	category: string;
}

interface ArticleFrontmatter extends ArticleBase {
	published: boolean;
}

/**
 * 指定されたディレクトリ配下のマークダウンファイルを再帰的に検索
 */
function findMarkdownFiles(
	dir: string,
	baseDir: string
): Array<{ filePath: string; category: string }> {
	const results: Array<{ filePath: string; category: string }> = [];

	if (!fs.existsSync(dir)) {
		return results;
	}

	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// サブディレクトリを再帰的に検索
			results.push(...findMarkdownFiles(fullPath, baseDir));
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			// カテゴリはbaseDir からの相対パス（親ディレクトリ名）
			const relativePath = path.relative(baseDir, dir);
			const category = relativePath || 'uncategorized';
			results.push({ filePath: fullPath, category });
		}
	}

	return results;
}

/**
 * マークダウン記事のインデックスをビルド
 */
export async function buildArticleIndex(): Promise<void> {
	const articlesDir = path.join(process.cwd(), 'src/lib/data/articles/ja');
	const outputPath = path.join(process.cwd(), 'src/lib/data/articles/ja/index.json');

	const articles: ArticleIndex[] = [];

	if (!fs.existsSync(articlesDir)) {
		fs.mkdirSync(articlesDir, { recursive: true });
		fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
		console.warn('⚠ Articles directory not found, created empty index');
		return;
	}

	const markdownFiles = findMarkdownFiles(articlesDir, articlesDir);

	for (const { filePath, category } of markdownFiles) {
		const content = fs.readFileSync(filePath, 'utf-8');

		try {
			const { data } = matter(content);
			const fm = data as ArticleFrontmatter;

			if (fm.published) {
				const filename = path.basename(filePath, '.md');
				articles.push({
					slug: `${category}/${filename}`,
					title: fm.title,
					description: fm.description,
					category,
					tags: fm.tags || []
				});
			}
		} catch (error) {
			console.error(`Error processing ${filePath}:`, error);
		}
	}

	fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
	if (!process.env.VITEST) {
		console.log(`✓ Generated index for ${articles.length} articles`);
	}
}

/**
 * 記事インデックスを自動生成するViteプラグイン
 */
export function articleIndexPlugin(): Plugin {
	return {
		name: 'article-index',
		async buildStart() {
			await buildArticleIndex();
		},
		async configureServer(server) {
			await buildArticleIndex();

			server.watcher.add('src/lib/data/articles/**/*.md');
			server.watcher.on('change', async (file) => {
				if (file.includes('src/lib/data/articles') && file.endsWith('.md')) {
					await buildArticleIndex();
				}
			});
		}
	};
}
