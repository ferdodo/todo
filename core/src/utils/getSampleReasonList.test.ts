import { describe, it, expect } from "vitest";
import { getSampleReasonList } from "./getSampleReasonList";

describe("getSampleReasonList", () => {
	it("should contain only non-empty strings", () => {
		const reasons = getSampleReasonList();
		reasons.forEach((reason) => {
			expect(typeof reason).toBe("string");
			expect(reason.length).toBeGreaterThan(0);
		});
	});
});
