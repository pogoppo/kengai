import { sequence } from '@sveltejs/kit/hooks';
import { handleParaglide } from '#lib/server/paraglide.server.js';
import { handleBasicAuth } from '#lib/server/auth.server.js';

export const handle = sequence(handleBasicAuth, handleParaglide);
