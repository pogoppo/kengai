import * as m from '$lib/paraglide/messages.js';

/**
 * 全ての文字列（キー）を受け入れる、型安全でない翻訳関数
 */
export function unsafeMessages(key: string): string {
  const messages = m as unknown as Record<string, () => string>;
  return messages[key]?.() ?? key;
}
