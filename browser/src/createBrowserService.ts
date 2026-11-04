import type { DeviceType } from "./DeviceType";

export function createBrowserService(): {
	getDevice(): DeviceType;
	toggleFullscreen(): void;
	applyPullToRefresh(enabled: boolean): void;
	confirm(message: string): boolean;
	clearStorage(): void;
	refreshPage(): void;
	clipboardCopy(text: string): boolean;
	readFile(): Promise<string>;
} {
	
	function getDevice(): DeviceType {
		if (typeof window === "undefined" || typeof navigator === "undefined") {
			return "unknown";
		}

		const userAgent = navigator.userAgent;
		const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		
		// Détection iOS
		if (/iPhone|iPad|iPod/.test(userAgent)) {
			return "ios-safari";
		}
		
		// Détection Android
		if (/Android/.test(userAgent)) {
			if (/Firefox/.test(userAgent)) {
				return "android-firefox";
			} else if (/Edg/.test(userAgent)) {
				return "android-edge";
			} else if (/Chrome/.test(userAgent)) {
				return "android-chrome";
			}
		}
		
		// Détection Desktop
		if (!isMobile) {
			if (/Firefox/.test(userAgent)) {
				return "desktop-firefox";
			} else if (/Edg/.test(userAgent)) {
				return "desktop-edge";
			} else if (/Chrome/.test(userAgent)) {
				return "desktop-chrome";
			} else if (/Safari/.test(userAgent)) {
				return "desktop-safari";
			}
		}
		
		return "unknown";
	}

	function applyPullToRefreshSettings(enabled: boolean): void {
		if (typeof document === "undefined" || typeof window === "undefined") {
			return;
		}

		const body = document.body;
		const html = document.documentElement;

		if (enabled) {
			// Réactiver le pull-to-refresh
			body.style.overscrollBehaviorY = "";
			html.style.overscrollBehaviorY = "";
		} else {
			// Désactiver le pull-to-refresh avec CSS uniquement
			// overscroll-behavior-y: none empêche le pull-to-refresh sans affecter le scroll normal
			body.style.overscrollBehaviorY = "none";
			html.style.overscrollBehaviorY = "none";
		}
	}

	return {
		getDevice,

		toggleFullscreen(): void {
			if (typeof document === "undefined") {
				return;
			}
			if (!document.fullscreenElement) {
				// Entrer en plein écran
				void document.documentElement.requestFullscreen();
			} else {
				// Sortir du plein écran
				void document.exitFullscreen();
			}
		},

		applyPullToRefresh(enabled: boolean): void {
			applyPullToRefreshSettings(enabled);
		},

		confirm(message: string): boolean {
			if (typeof window === "undefined") {
				return false;
			}
			return window.confirm(message);
		},

		clearStorage(): void {
			if (typeof window === "undefined") {
				return;
			}

			window.localStorage.clear();
		},

		refreshPage(): void {
			if (typeof window === "undefined") {
				return;
			}

			window.location.reload();
		},

		clipboardCopy(text: string): boolean {
			if (typeof document === "undefined") {
				return false;
			}

			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.select();
			const success = document.execCommand("copy");
			document.body.removeChild(textarea);
			return success;
		},

		async readFile(): Promise<string> {
			if (typeof window === "undefined" || typeof document === "undefined") {
				throw new Error("File API not available in this environment");
			}

			return new Promise((resolve, reject) => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".json";

				input.onchange = () => {
					const file = input.files?.[0];
					if (!file) {
						reject(new Error("No file selected"));
						return;
					}

					const reader = new FileReader();
					reader.onload = () => {
						const content = reader.result;
						if (typeof content === "string") {
							resolve(content);
						} else {
							reject(new Error("Failed to read file"));
						}
					};
					reader.onerror = () => {
						reject(new Error("Error reading file"));
					};
					reader.readAsText(file);
				};

				input.click();
			});
		},
	};
}
