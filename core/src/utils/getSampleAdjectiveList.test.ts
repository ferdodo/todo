import { describe, it, expect } from "vitest";
import { getSampleAdjectiveList } from "./getSampleAdjectiveList";

describe("getSampleAdjectiveList", () => {
	it("should contain only non-empty strings", () => {
		const adjectives = getSampleAdjectiveList();
		adjectives.forEach((adj) => {
			expect(typeof adj).toBe("string");
			expect(adj.length).toBeGreaterThan(0);
		});
	});
});
