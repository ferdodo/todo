import { describe, it, expect } from "vitest";
import { resurrectHero } from "./resurrectHero";
import type { Hero } from "../entities/Hero";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("resurrectHero", () => {
	it("should resurrect a dead hero", () => {
		const context = createMockTodoContext();
		let updatedHero: Hero | null = null;
		const deadHero: Hero = {
			id: "hero-1",
			health: 0,
			level: 5,
			xp: 1000,
		};

		context.heroRepository.get = (): Hero => deadHero;
		context.heroRepository.update = (hero: Hero): void => {
			updatedHero = hero;
		};

		resurrectHero(context);

		expect(updatedHero).toEqual({
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 1000,
		});
	});

	it("should not update a living hero", () => {
		const context = createMockTodoContext();
		let updateCalled = false;
		const livingHero: Hero = {
			id: "hero-1",
			health: 50,
			level: 5,
			xp: 1000,
		};

		context.heroRepository.get = (): Hero => livingHero;
		context.heroRepository.update = (): void => {
			updateCalled = true;
		};

		resurrectHero(context);

		expect(updateCalled).toBe(false);
	});
});
