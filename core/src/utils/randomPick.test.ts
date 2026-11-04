import { describe, it, expect } from "vitest";
import { randomPick } from "./randomPick";

describe("randomPick", () => {
	it("should return a value from the array", () => {
		const array = ["apple", "banana", "cherry"];
		const picked = randomPick(array);
		expect(array).toContain(picked);
	});

	it("should throw error for empty array", () => {
		const array: string[] = [];
		expect(() => randomPick(array)).toThrow("Cannot pick from an empty array");
	});

	it("should pick different values across multiple calls", () => {
		const array = [1, 2, 3, 4, 5];
		const picks = new Set<number>();

		for (let i = 0; i < 50; i++) {
			picks.add(randomPick(array));
		}

		expect(picks.size).toBeGreaterThan(1);
	});
});
