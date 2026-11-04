import { describe, it, expect } from "vitest";
import { generatePunctualTaskWithWeightLowerThanFive } from "./generatePunctualTaskWithWeightLowerThanFive";

describe("generatePunctualTaskWithWeightLowerThanFive", () => {
	it("should generate a punctual task with required properties", () => {
		const task = generatePunctualTaskWithWeightLowerThanFive();
		expect(task).toHaveProperty("id");
		expect(task).toHaveProperty("name");
		expect(task).toHaveProperty("status");
		expect(task).toHaveProperty("weight");
	});

	it("should have status set to todo", () => {
		const task = generatePunctualTaskWithWeightLowerThanFive();
		expect(task.status).toBe("todo");
	});

	it("should have weight lower than -5", () => {
		const task = generatePunctualTaskWithWeightLowerThanFive();
		expect(task.weight).toBeLessThan(-5);
	});
});
