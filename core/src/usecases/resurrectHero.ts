import type { TodoContext } from "../contexts/TodoContext";

export function resurrectHero(context: TodoContext): void {
	const hero = context.heroRepository.get();
	if (hero.health <= 0) {
		context.heroRepository.update({
			...hero,
			health: 100,
			level: 1,
		});
	}
}
