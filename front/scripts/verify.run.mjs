import { spawn } from "node:child_process";

export function taskSpawn(task, title, command, next) {
	return task(title, async ({task, streamPreview, setError}) => {
		await new Promise((resolve, reject) => {
			const child = spawn(command, {
				shell: true,
				stdio: ["ignore", "pipe", "pipe"],
			});
			const previewTimeout = setTimeout(() => {
				child.stdout?.pipe(streamPreview, {end: false});
				child.stderr?.pipe(streamPreview, {end: false});
			}, 15_000);
			let stdout = "";
			let stderr = "";

			child.stdout?.on("data", (chunk) => {
				stdout += chunk.toString();
			});

			child.stderr?.on("data", (chunk) => {
				stderr += chunk.toString();
			});

			child.on("error", (error) => {
				clearTimeout(previewTimeout);
				setError(error);
				reject(error);
			});

			child.on("close", (code) => {
				clearTimeout(previewTimeout);

				if (code === 0) {
					resolve();
					return;
				}

				const error = new Error(`\n\n${command}\n\n${stdout}\n\n${stderr}\n\n`);
				setError(error);
				reject(error);
			});
		});

		if (next !== undefined) {
			await next(task);
		}
	}, {
		previewLines: 20,
	});
}
