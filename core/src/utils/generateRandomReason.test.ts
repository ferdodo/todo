import { describe, it, expect } from "vitest";
import { generateRandomReason } from "./generateRandomReason";
import { getSampleReasonList } from "./getSampleReasonList";

describe("generateRandomReason", () => {
	it("should return a reason from the sample list", () => {
		const reason = generateRandomReason();
		const sampleReasons = getSampleReasonList();
		expect(sampleReasons).toContain(reason);
	});
});
