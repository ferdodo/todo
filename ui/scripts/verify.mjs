import task from "tasuku";
import { exec } from "node:child_process";
import { promisify } from "node:util";

function run(command) {
	return promisify(exec)(command).catch(error => {
		throw new Error(`${error.stdout}\n${error.stderr}`);
	});
}

task.group(task => [
	task("Linting", () => run("biome ci ./src")),
	task("Validating file names", () => run("exportcase check ./src")),
	task("Auditing", () => run("npm audit --audit-level=critical")),
	task("Type checking", () => run("tsc --noEmit")),
], {
	concurrency: 2,
	stopOnError: true,
});
