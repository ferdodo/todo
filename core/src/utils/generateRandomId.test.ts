import { describe, it, expect } from "vitest";
import { generateRandomId } from "./generateRandomId";

describe("generateRandomId", () => {
	it("should return a string starting with id-", () => {
		const id = generateRandomId();
		expect(id).toMatch(/^id-[a-z0-9]+$/);
	});
});
