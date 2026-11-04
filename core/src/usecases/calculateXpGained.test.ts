import { describe, it, expect } from "vitest";
import { calculateXpGained } from "./calculateXpGained";
import type { RecurringTask, PunctualTask } from "../entities";

describe("calculateXpGained", () => {
	it("should return 0 when there are no tasks", () => {
		const result = calculateXpGained([], []);
		expect(result).toBe(0);
	});

	it("should calculate XP based on weight of completed recurring tasks", () => {
		const recurringTasks: RecurringTask[] = [
			{ id: "t1", name: "T1", status: "done", weight: 2 },
			{ id: "t2", name: "T2", status: "todo", weight: 1 },
		];
		// completedWeightSum = 2, totalWeightSum = 3
		// xpGained = 2 * (10 / 3) = 6.666...
		const result = calculateXpGained(recurringTasks, []);
		expect(result).toBeCloseTo(6.67, 1);
	});

	it("should calculate XP based on weight of completed punctual tasks", () => {
		const punctualTasks: PunctualTask[] = [
			{ id: "t1", name: "T1", status: "done", weight: 3 },
			{ id: "t2", name: "T2", status: "todo", weight: 2 },
		];
		// completedWeightSum = 3, totalWeightSum = 5
		// xpGained = 3 * (10 / 5) = 6
		const result = calculateXpGained([], punctualTasks);
		expect(result).toBe(6);
	});

});
