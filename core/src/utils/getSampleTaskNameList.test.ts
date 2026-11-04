import { describe, it, expect } from "vitest";
import { getSampleTaskNameList } from "./getSampleTaskNameList";

describe("getSampleTaskNameList", () => {
	it("should return a non-empty array", () => {
		const tasks = getSampleTaskNameList();
		expect(Array.isArray(tasks)).toBe(true);
		expect(tasks.length).toBeGreaterThan(0);
	});

	it("should contain only non-empty strings", () => {
		const tasks = getSampleTaskNameList();
		tasks.forEach((task) => {
			expect(typeof task).toBe("string");
			expect(task.length).toBeGreaterThan(0);
		});
	});
});
