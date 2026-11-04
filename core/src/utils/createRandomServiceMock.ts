import type { RandomService } from "../services/RandomService";

export function createRandomServiceMock(): RandomService {
	return {
		createIntPRNG: (seed: string) => {
			// Create a deterministic seed from the string
			let state = 0;
			for (let i = 0; i < seed.length; i++) {
				state = ((state << 5) - state) + seed.charCodeAt(i);
				state = state & state; // Convert to 32-bit integer
			}
			state = Math.abs(state);
			
			return (min: number, max: number) => {
				state = (state * 1103515245 + 12345) & 0x7fffffff;
				return min + (state % (max - min + 1));
			};
		},
	};
}

