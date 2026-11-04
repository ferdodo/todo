export interface RandomService {
	createIntPRNG(seed: string): (min: number, max: number) => number;
}

