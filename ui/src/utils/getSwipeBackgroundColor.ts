export const getSwipeBackgroundColor = (swipeOffset: number): string => {
	if (swipeOffset > 0) {
		return "var(--color-green)";
	}
	if (swipeOffset < 0) {
		return "var(--color-orange)";
	}
	return "white";
};
