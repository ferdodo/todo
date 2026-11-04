import { weightToColor } from "./weightToColor";

export function weightToDifficulty(weight: number): { label: string; color: string } {
	const color = weightToColor(weight);

	if (weight <= 1) {
		return { label: "easy", color };
	}
	if (weight <= 2) {
		return { label: "normal", color };
	}
	return { label: "boss", color };
}
