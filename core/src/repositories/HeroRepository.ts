import type { Hero } from "../entities";

export interface HeroRepository {
	get(): Hero;
	update(hero: Hero): void;
	observe(listener: (hero: Hero) => void): () => void;
}
