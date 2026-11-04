import type { DeviceType } from "../utils/DeviceType";

export interface BrowserService {
	getDevice(): DeviceType;
	toggleFullscreen(): void;
	applyPullToRefresh(enabled: boolean): void;
	confirm(message: string): boolean;
	clearStorage(): void;
	refreshPage(): void;
	clipboardCopy(text: string): boolean;
	readFile(): Promise<string>;
}
