import task from "tasuku";
import { taskSpawn } from "./verify.run.mjs";

task.group(task => [
	taskSpawn(task, "type checking", "tsc --noEmit", async (task) => {
		await taskSpawn(task, "Testing", "vitest run", async (task) => {
			await taskSpawn(task, "Running mutation testing", "node ./scripts/run-mutation.mjs", async (task) => {
				await taskSpawn(task, "Checking non-killing tests", "node ./scripts/check-non-killing-tests.mjs");
			});
		});
	}),
	taskSpawn(task, "Linting", "biome ci ./src"),
	taskSpawn(task, "Checking hooks complexity", "biome ci --config-path=./biome.complexity.json ./src"),
	taskSpawn(task, "Validating file names", "exportcase check ./src"),
	taskSpawn(task, "Checking type assertions", "node ./scripts/check-as-pattern.mjs"),
	taskSpawn(task, "Auditing", "npm audit --audit-level=critical"),
], {
	concurrency: 2,
	stopOnError: true,
});
