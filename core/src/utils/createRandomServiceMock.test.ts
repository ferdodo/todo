import { describe, it, expect } from "vitest";
import { createRandomServiceMock } from "./createRandomServiceMock";

describe("createRandomServiceMock", () => {
	it("should respect min and max bounds", () => {
		const randomService = createRandomServiceMock();
		const prng = randomService.createIntPRNG("bounded-seed");

		for (let i = 0; i < 100; i++) {
			const num = prng(10, 20);
			expect(num).toBeGreaterThanOrEqual(10);
			expect(num).toBeLessThanOrEqual(20);
		}
	});
});
