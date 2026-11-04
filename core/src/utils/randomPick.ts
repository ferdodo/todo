export function randomPick<T>(array: T[]): T {
	if (array.length === 0) {
		throw new Error("Cannot pick from an empty array");
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}
