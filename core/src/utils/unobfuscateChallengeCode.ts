import type { UnobfuscateResult } from "./UnobfuscateResult";
import type { RandomService } from "../services/RandomService";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Unobfuscate a challenge code by reversing the deterministic permutation.
 * Returns the original 14-character code, or an error with hint if invalid.
 */
export function unobfuscateChallengeCode(
	obfuscatedCode: string,
	randomService: RandomService
): UnobfuscateResult {
	if (obfuscatedCode.length !== 16) {
		return { result: "error", hint: "Le code doit contenir exactement 16 caractères" };
	}

	try {
		// Extract the original code and checksum
		const shuffled = obfuscatedCode.substring(0, 14);
		const checksum = obfuscatedCode.substring(14, 16);

		// Recreate the same permutation indices
		const randomInt = randomService.createIntPRNG("challenge-obfuscate");

		// Generate permutation indices (same Fisher-Yates shuffle)
		const indices = Array.from({ length: 14 }, (_, i) => i);
		for (let i = 13; i > 0; i--) {
			const j = randomInt(0, i);
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}

		// Reverse the permutation: create inverse mapping
		const inverseIndices = new Array(14);
		for (let i = 0; i < 14; i++) {
			inverseIndices[indices[i]] = i;
		}

		// Apply inverse permutation to get original code
		let original = "";
		for (let i = 0; i < 14; i++) {
			original += shuffled[inverseIndices[i]];
		}

		// Verify checksum
		const expectedChecksumSeed = `${original}:obfuscate`;
		const checksumRandom = randomService.createIntPRNG(expectedChecksumSeed);
		let expectedChecksum = "";
		for (let i = 0; i < 2; i++) {
			const index = checksumRandom(0, CHARSET.length - 1);
			expectedChecksum += CHARSET[index];
		}

		if (checksum !== expectedChecksum) {
			return { result: "error", hint: "Ce code n'est pas valide ou a été altéré" };
		}

		return { result: { code: original } };
	} catch {
		return { result: "error", hint: "Le code contient des caractères invalides ou un format incorrect" };
	}
}
