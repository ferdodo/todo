import { createBrowserService } from "./createBrowserService";

// Instance singleton du service Browser
let browserServiceInstance: ReturnType<typeof createBrowserService> | null = null;

export function getBrowserService(): ReturnType<typeof createBrowserService> {
	if (!browserServiceInstance) {
		browserServiceInstance = createBrowserService();
	}
	return browserServiceInstance;
}

