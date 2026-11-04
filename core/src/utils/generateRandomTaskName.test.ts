import { describe, it, expect } from "vitest";
import { generateRandomTaskName } from "./generateRandomTaskName";
import { getSampleAdjectiveList } from "./getSampleAdjectiveList";
import { getSampleTaskNameList } from "./getSampleTaskNameList";

describe("generateRandomTaskName", () => {
	it("should return a non-empty string", () => {
		const name = generateRandomTaskName();
		expect(typeof name).toBe("string");
		expect(name.length).toBeGreaterThan(0);
	});
});
