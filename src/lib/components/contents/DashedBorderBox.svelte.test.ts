import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import DashedBorderBox from './DashedBorderBox.svelte';

describe('DashedBorderBox', () => {
  test('ボックスが表示される', async () => {
    const children = createRawSnippet(() => ({
      render: () => '<div>Test Content</div>'
    }));
    render(DashedBorderBox, { children });

    const box = page.getByText('Test Content');
    await expect.element(box).toBeInTheDocument();
  });
});
