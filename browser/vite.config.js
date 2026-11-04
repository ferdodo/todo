import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/index.ts",
			name: "@todo/browser",
			fileName: () => "index.js",
			formats: ["es"],
		},
	},
});

