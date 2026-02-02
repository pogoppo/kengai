import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
	faRibbon,
	faCampground,
	faCarSide,
	faMotorcycle,
	faTent,
	faGear
} from '@fortawesome/free-solid-svg-icons';
import { unsafeMessages } from './i18n';

const CATEGORY_ICONS: Record<string, IconProp> = {
	_mock: faGear,
	tarp: faCampground,
	tent: faTent,
	'rope-work': faRibbon,
	'moto-trouble': faMotorcycle,
	'car-trouble': faCarSide
};

export function categoryIcon(slug: string): IconProp {
	return CATEGORY_ICONS[slug] || null;
}

export function categoryLabel(slug: string): string {
	return unsafeMessages(`category.${slug}.label`);
}
