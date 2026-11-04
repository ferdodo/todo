import type { Hero, HeroRepository } from "@todo/core";

const STORAGE_KEY = "todo_hero";
const DEFAULT_HERO: Hero = {
	id: "hero-1",
	health: 100,
	level: 1,
	xp: 0,
};

export function createHeroRepository(): HeroRepository {
	const listeners: Array<(hero: Hero) => void> = [];

	const getHero = (): Hero => {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : DEFAULT_HERO;
	};

	const saveHero = (hero: Hero): void => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
		listeners.forEach((listener) => {
			listener(hero);
		});
	};

	return {
		get: () => getHero(),
		update: (hero: Hero) => {
			saveHero(hero);
		},
		observe: (listener: (hero: Hero) => void) => {
			listeners.push(listener);
			return () => {
				const index = listeners.indexOf(listener);
				if (index !== -1) {
					listeners.splice(index, 1);
				}
			};
		},
	};
}
