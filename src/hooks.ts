import type { Transport } from '@sveltejs/kit/hooks';
import { deLocalizeUrl } from '#lib/paraglide/runtime.js';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;
export const transport: Transport = {};
