# Copilot Instructions for kengai

## Project Overview

This is a **SvelteKit** application using **Svelte 5** with internationalization (i18n) support via **Paraglide JS**. The project follows SvelteKit conventions and uses TypeScript throughout.

## Architecture & Key Patterns

### Internationalization (i18n)
- **Paraglide JS** handles i18n with Japanese (`ja`) as the base locale
- Message files: [messages/ja.json](messages/ja.json)
- Configuration: [project.inlang/settings.json](project.inlang/settings.json)
- Generated runtime at `$lib/paraglide/` (auto-generated, don't edit manually)
- Use `localizeHref()` for locale-aware routing ([src/routes/+layout.svelte](src/routes/+layout.svelte#L12))
- [src/hooks.server.ts](src/hooks.server.ts) implements `paraglideMiddleware` for server-side i18n handling
- [src/hooks.ts](src/hooks.ts) implements URL delocalizing via `reroute` hook

### Testing Strategy
Two separate test projects configured in [vite.config.ts](vite.config.ts):
1. **Client tests** (`.svelte.{test,spec}.{js,ts}`): Vitest browser mode with Playwright
   - Use `vitest-browser-svelte` for component rendering
   - Example: [src/routes/page.svelte.spec.ts](src/routes/page.svelte.spec.ts)
2. **Server tests** (`.{test,spec}.{js,ts}`): Node environment
   - Example: [src/demo.spec.ts](src/demo.spec.ts)
3. **E2E tests**: Playwright in [e2e/](e2e/) directory

Run tests with:
- `npm run test:unit` - Unit tests (vitest)
- `npm run test:e2e` - E2E tests (playwright)
- `npm test` - All tests

### File Extensions & Preprocessors
- Uses `vitePreprocess()` preprocessor ([svelte.config.js](svelte.config.js))
- Article content is managed in Markdown files with frontmatter, processed via `gray-matter`

### Deployment
- Configured for **Vercel** via `@sveltejs/adapter-vercel`
- Build: `npm run build`, Preview: `npm run preview`

## Development Workflow

### Essential Commands
```bash
npm run dev              # Start dev server
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
npm run format           # Format with Prettier
npm run lint             # Lint with ESLint + Prettier check
npm run prepare          # Sync SvelteKit types (runs automatically)
```

### Code Quality
- **ESLint**: Flat config ([eslint.config.js](eslint.config.js)) with TypeScript, Svelte, and Prettier integration
- **TypeScript**: Strict mode enabled, uses SvelteKit's generated tsconfig
- `no-undef` rule disabled for TypeScript (per typescript-eslint recommendations)
- Prettier integrated with both ESLint and Svelte configs

### CSS Conventions
- **Use native CSS nesting**: This project uses standard CSS nesting syntax (supported natively in modern browsers)
- Prefer `>` child combinator for direct descendants (e.g., `> li`, `> a`)
- Use `&` for pseudo-classes, pseudo-elements, and modifier selectors (e.g., `&:hover`, `&::before`, `&[data-current="true"]`)
- Nest related selectors to maintain clear hierarchy and avoid repetitive class names

## Svelte 5 Specific Conventions

When working with Svelte code:
1. **Always use MCP tools** for Svelte development:
   - Use `list-sections` first to discover relevant documentation
   - Use `get-documentation` to fetch needed sections
   - Use `svelte-autofixer` to validate all Svelte code before finalizing
2. Follow Svelte 5 patterns (runes: `$state`, `$derived`, `$props`, etc.)
3. See [AGENTS.md](AGENTS.md) for detailed MCP workflow

## Project-Specific Conventions

- Vitest requires assertions (`expect.requireAssertions: true`)
- Generated paraglide files are in `src/lib/paraglide/` - reference but don't modify
- Type definitions in [src/app.d.ts](src/app.d.ts) extend SvelteKit types
- Path aliases handled by SvelteKit config, `$lib` maps to `src/lib`
- Uses `vite-plugin-devtools-json` for development tooling

## Using the Svelte MCP Server

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
