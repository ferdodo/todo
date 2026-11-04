export function normalizeWord(word: string): string {
	return word
		.normalize("NFD")
		.toLowerCase()
		.replace(/[\u0300-\u036f]/g, "");
}
