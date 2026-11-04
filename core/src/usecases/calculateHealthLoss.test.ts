import { describe, it, expect } from "vitest";
import { calculateHealthLoss } from "./calculateHealthLoss";
import type { RecurringTask, PunctualTask } from "../entities";

describe("calculateHealthLoss", () => {
	it("should return 0 when there are no tasks", () => {
		const result = calculateHealthLoss([], []);
		expect(result).toBe(0);
	});

	it("should calculate health loss based on weight of unfinished recurring tasks", () => {
		const recurringTasks: RecurringTask[] = [
			{ id: "t1", name: "T1", status: "todo", weight: 2 },
			{ id: "t2", name: "T2", status: "done", weight: 1 },
		];
		// unfinishedWeightSum = 2, totalWeightSum = 3
		// healthLoss = 2 * (10 / 3) = 6.666...
		const result = calculateHealthLoss(recurringTasks, []);
		expect(result).toBeCloseTo(6.67, 1);
	});

	it("should calculate health loss based on weight of unfinished punctual tasks", () => {
		const punctualTasks: PunctualTask[] = [
			{ id: "t1", name: "T1", status: "todo", weight: 3 },
			{ id: "t2", name: "T2", status: "done", weight: 2 },
		];
		// unfinishedWeightSum = 3, totalWeightSum = 5
		// healthLoss = 3 * (10 / 5) = 6
		const result = calculateHealthLoss([], punctualTasks);
		expect(result).toBe(6);
	});

});
