/**
 * 構造化データをJSON-LDとしてHTMLへ埋め込むための変換
 * schema.orgのノードの組み立ては $lib/utils/structured-data が担う
 */

/** JSON-LDとして直列化できるデータ */
export type JsonLd = Record<string, unknown>;

/**
 * JSON-LDを<script>内へ安全に埋め込める文字列へ変換する
 * `</script>` によるエスケープ脱出を防ぐため < > & をユニコードエスケープする
 */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
	return JSON.stringify(data)
		.replace(/&/g, '\\u0026')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e');
}
