import { sequence } from "@sveltejs/kit/hooks";
import { handleParaglide } from "$lib/server/paraglide.server";
import { handleBasicAuth } from "$lib/server/auth.server";

export const handle = sequence(handleBasicAuth, handleParaglide);
