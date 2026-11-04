import { describe, it, expect } from "vitest";
import { encodeChallengeCode } from "./encodeChallengeCode";
import { createRandomServiceMock } from "./createRandomServiceMock";

describe("encodeChallengeCode", () => {
	const playerId = "player-123";
	const realDay = "2026-04-25";
	const level = 5;

	it("should encode a challenge code with correct length", () => {
		const randomService = createRandomServiceMock();
		const code = encodeChallengeCode(playerId, realDay, level, randomService);
		expect(code).toHaveLength(16);
		expect(typeof code).toBe("string");
	});

	it("should encode different levels differently", () => {
		const randomService = createRandomServiceMock();
		const code1 = encodeChallengeCode(playerId, realDay, 1, randomService);
		const code2 = encodeChallengeCode(playerId, realDay, 2, randomService);
		const code5 = encodeChallengeCode(playerId, realDay, level, randomService);
		const code99 = encodeChallengeCode(playerId, realDay, 99, randomService);

		// All should be different
		expect(new Set([code1, code2, code5, code99]).size).toBe(4);
	});

	it("should reject invalid levels", () => {
		const randomService = createRandomServiceMock();
		expect(() => encodeChallengeCode(playerId, realDay, 0, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, realDay, 100, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, realDay, -1, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, realDay, 101, randomService)).toThrow();
	});

	it("should reject invalid date format", () => {
		const randomService = createRandomServiceMock();
		expect(() => encodeChallengeCode(playerId, "2026-4-25", level, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, "04/25/2026", level, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, "2026/04/25", level, randomService)).toThrow();
		expect(() => encodeChallengeCode(playerId, "25-04-2026", level, randomService)).toThrow();
	});
});

