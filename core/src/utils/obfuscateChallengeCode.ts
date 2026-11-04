import type { RandomService } from "../services/RandomService";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Obfuscate a challenge code by shuffling characters using a deterministic permutation.
 * This makes it harder to manually counterfeit codes.
 * Uses a fixed seed-based permutation so the shuffling is consistent.
 */
export function obfuscateChallengeCode(code: string, randomService: RandomService): string {
	if (code.length !== 14) {
		throw new Error("Code must be exactly 14 characters");
	}

	// Create a deterministic shuffle using a fixed seed
	// We use the code itself as a seed to make the permutation reproducible
	const randomInt = randomService.createIntPRNG("challenge-obfuscate");

	// Generate permutation indices (Fisher-Yates shuffle)
	const indices = Array.from({ length: 14 }, (_, i) => i);
	for (let i = 13; i > 0; i--) {
		const j = randomInt(0, i);
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}

	// Apply permutation to code
	let obfuscated = "";
	for (let i = 0; i < 14; i++) {
		obfuscated += code[indices[i]];
	}

	// Add a checksum at the end to make verification harder (2 extra chars)
	const checksumSeed = `${code}:obfuscate`;
	const checksumRandom = randomService.createIntPRNG(checksumSeed);
	let checksum = "";
	for (let i = 0; i < 2; i++) {
		const index = checksumRandom(0, CHARSET.length - 1);
		checksum += CHARSET[index];
	}

	return obfuscated + checksum;
}
