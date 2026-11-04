import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from "node:child_process";

async function spawnLive(command, commandArgs) {
	console.log(`${command} ${commandArgs.join(' ')}\n\n`);
	return new Promise((resolve) => {
		const child = spawn(command, commandArgs, { stdio: 'inherit' });

		child.on('close', code => {
			if (code !== 0) {
				process.exit(code);
			}
			resolve();
		});
	});
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMutation() {
	const scriptPath = join(__dirname, 'print-files-to-be-mutated.mjs');
	const result = execSync(`node ${scriptPath}`, { stdio: 'pipe', encoding: 'utf8' });
	const filesToMutate = result.toString().split('\n').filter(Boolean);

	if (filesToMutate.length === 0) {
		console.log('No files to mutate');
		return;
	}

	await spawnLive("npx", `stryker run --concurrency 2 --mutate ${filesToMutate.join(',')}`.split(' '));
}

runMutation();