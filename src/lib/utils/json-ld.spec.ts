import { describe, it, expect } from 'vitest';
import { serializeJsonLd } from './json-ld';

describe('serializeJsonLd', () => {
	it('scriptの閉じタグをエスケープして脱出を防ぐ', () => {
		const json = serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });

		expect(json).not.toContain('</script>');
		expect(json).not.toContain('<img');
		expect(json).toContain('\\u003c');
	});

	it('エスケープしてもJSONとして復元できる', () => {
		const name = 'A & B <c>';
		const json = serializeJsonLd({ name });

		expect(JSON.parse(json)).toEqual({ name });
	});

	it('配列もそのまま直列化できる', () => {
		const json = serializeJsonLd([{ '@type': 'WebSite' }, { '@type': 'Organization' }]);

		expect(JSON.parse(json)).toEqual([{ '@type': 'WebSite' }, { '@type': 'Organization' }]);
	});
});
