import { describe, it, expect } from "vitest";
import { calculateHeroStats } from "./calculateHeroStats";
import type { Hero, RecurringTask } from "../entities";

describe("calculateHeroStats", () => {
	it("should calculate stats with no tasks", () => {
		const hero: Hero = { id: "h1", health: 100, level: 1, xp: 50 };
		const stats = calculateHeroStats(hero, [], []);

		expect(stats.healthPercent).toBe(100);
		expect(stats.healthLoss).toBe(0);
		expect(stats.projectedHealth).toBe(100);
		expect(stats.xpGained).toBe(0);
		expect(stats.projectedXp).toBe(50);
		expect(stats.willLevelUp).toBe(false);
	});

	it("should calculate projected health loss with unfinished tasks", () => {
		const hero: Hero = { id: "h1", health: 100, level: 1, xp: 0 };
		const tasks: RecurringTask[] = [
			{ id: "t1", name: "T1", status: "todo", weight: 1 },
			{ id: "t2", name: "T2", status: "done", weight: 1 },
		];
		const stats = calculateHeroStats(hero, tasks, []);

		// 1 unfinished * (10 / 2) = 5 damage
		expect(stats.healthLoss).toBe(5);
		expect(stats.projectedHealth).toBe(95);
	});

	it("should calculate projected XP with completed tasks", () => {
		const hero: Hero = { id: "h1", health: 100, level: 1, xp: 50 };
		const tasks: RecurringTask[] = [
			{ id: "t1", name: "T1", status: "todo", weight: 1 },
			{ id: "t2", name: "T2", status: "done", weight: 1 },
		];
		const stats = calculateHeroStats(hero, tasks, []);

		// 1 completed * (10 / 2) = 5 XP
		expect(stats.xpGained).toBe(5);
		expect(stats.projectedXp).toBe(55);
	});

	it("should detect level up", () => {
		const hero: Hero = { id: "h1", health: 100, level: 1, xp: 95 };
		const tasks: RecurringTask[] = [
			{ id: "t1", name: "T1", status: "done", weight: 1 },
			{ id: "t2", name: "T2", status: "todo", weight: 1 },
		];
		const stats = calculateHeroStats(hero, tasks, []);

		// 1 completed * (10 / 2) = 5 XP, total = 100
		expect(stats.xpGained).toBe(5);
		expect(stats.projectedXp).toBe(100);
		expect(stats.willLevelUp).toBe(true);
		expect(stats.projectedLevel).toBe(2);
		expect(stats.projectedXpAfterLevelUp).toBe(0);
	});

});
