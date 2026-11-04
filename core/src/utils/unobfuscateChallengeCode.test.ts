import { describe, it, expect } from "vitest";
import { unobfuscateChallengeCode } from "./unobfuscateChallengeCode";
import { obfuscateChallengeCode } from "./obfuscateChallengeCode";
import { createRandomServiceMock } from "./createRandomServiceMock";

describe("unobfuscateChallengeCode", () => {
	it("should return error result for tampered checksum", () => {
		const original = "01202604256X9K";
		const randomService = createRandomServiceMock();
		const obfuscated = obfuscateChallengeCode(original, randomService);

		const tampered = `${obfuscated.substring(0, 14)}XX`;
		const result = unobfuscateChallengeCode(tampered, randomService);

		expect(result.result).toBe("error");
		if (result.result === "error") {
			expect(result.hint).toContain("valide");
		}
	});

	it("should successfully unobfuscate a valid code", () => {
		const original = "01202604256X9K";
		const randomService = createRandomServiceMock();
		const obfuscated = obfuscateChallengeCode(original, randomService);

		const result = unobfuscateChallengeCode(obfuscated, randomService);

		expect(result.result).not.toBe("error");
		if (result.result !== "error") {
			expect(result.result.code).toBe(original);
		}
	});
});

