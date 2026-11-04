import type { BrowserService } from "../services/BrowserService";

export function createMockBrowserService(): BrowserService {
	// Import real Habitica user data for testing
	const habiticaData = {
		tasks: {
			dailys: [
				{ text: "Recurrent A", type: "daily" },
				{ text: "Recurrent B", type: "daily" },
			],
			todos: [
				{ text: "Punctual A", type: "todo" },
				{ text: "Punctual B", type: "todo" },
			],
		},
	};

	return {
		readFile: async () => JSON.stringify(habiticaData),
		getDevice: () => "unknown",
		toggleFullscreen: () => {},
		applyPullToRefresh: () => {},
		confirm: () => false,
		clearStorage: () => {},
		refreshPage: () => {},
		clipboardCopy: () => false,
	};
}
