import { describe, it, expect } from "vitest";
import { generateRecurringTaskWithWeightLowerThanFive } from "./generateRecurringTaskWithWeightLowerThanFive";

describe("generateRecurringTaskWithWeightLowerThanFive", () => {
	it("should generate a recurring task with required properties", () => {
		const task = generateRecurringTaskWithWeightLowerThanFive();
		expect(task).toHaveProperty("id");
		expect(task).toHaveProperty("name");
		expect(task).toHaveProperty("status");
		expect(task).toHaveProperty("weight");
	});

	it("should have weight lower than -5", () => {
		const task = generateRecurringTaskWithWeightLowerThanFive();
		expect(task.weight).toBeLessThan(-5);
	});

});
