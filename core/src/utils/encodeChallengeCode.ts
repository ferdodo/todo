import type { RandomService } from "../services/RandomService";
import { obfuscateChallengeCode } from "./obfuscateChallengeCode";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Encode level and realDay into a challenge code using playerId as HMAC-like signature.
 * The code is then obfuscated to prevent manual counterfeiting.
 * Returns a 16-character obfuscated code.
 */
export function encodeChallengeCode(playerId: string, realDay: string, level: number, randomService: RandomService): string {
	if (level < 1 || level > 99) throw new Error("Level must be between 1 and 99");
	if (!realDay.match(/^\d{4}-\d{2}-\d{2}$/)) throw new Error("realDay must be in YYYY-MM-DD format");

	// Encode level (1-99) into 2 chars
	const levelStr = String(level).padStart(2, "0");

	// Encode realDay (YYYY-MM-DD) into 8 chars by removing dashes
	const dayStr = realDay.replace(/-/g, "");

	// Create signature using playerId as seed
	const seed = `${playerId}:${levelStr}:${dayStr}`;
	const randomInt = randomService.createIntPRNG(seed);

	let signature = "";
	for (let i = 0; i < 4; i++) {
		const index = randomInt(0, CHARSET.length - 1);
		signature += CHARSET[index];
	}

	// Combine: level + day + signature (these are already alphanumeric)
	// Level: "05", Day: "20260425", Signature: "A1B2"
	// Total: 14 chars
	const code = levelStr + dayStr + signature;

	// Obfuscate the code to prevent manual counterfeiting
	return obfuscateChallengeCode(code, randomService);
}
