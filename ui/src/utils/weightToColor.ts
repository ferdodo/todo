/**
 * Converts a task weight to one of three fixed colors.
 * Weight 1 = Blue (easy), Weight 2 = Green (medium), Weight 3 = Red (hard)
 *
 * @param weight - The task weight (typically 1-3)
 * @returns CSS variable reference string
 */
export function weightToColor(weight: number): string {
	if (weight <= 1.5) {
		return 'var(--color-blue)';
	}
	if (weight <= 2.5) {
		return 'var(--color-green)';
	}
	return 'var(--color-red)';
}
