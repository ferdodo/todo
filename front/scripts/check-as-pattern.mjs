import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");

async function getFiles(dir) {
	const files = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await getFiles(fullPath)));
		} else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function checkAsPattern() {
	const files = await getFiles(srcDir);
	const violations = [];

	for (const file of files) {
		const content = await fs.readFile(file, "utf-8");
		const lines = content.split("\n");

		lines.forEach((line, index) => {
			if (line.includes(" as ")) {
				violations.push({
					file: path.relative(process.cwd(), file),
					line: index + 1,
					content: line.trim(),
				});
			}
		});
	}

	if (violations.length > 0) {
		console.error("❌ Type assertion pattern ' as ' found in code!");
		console.error("");
		console.error("⚠️  Usage of 'as' for type assertions can cause runtime inconsistencies:");
		console.error("   - It bypasses type checking");
		console.error("   - Values may not match the asserted type at runtime");
		console.error("   - This leads to unexpected behavior and bugs");
		console.error("");
		console.error("Violations found:");
		violations.forEach(({ file, line, content }) => {
			console.error(`  ${file}:${line}`);
			console.error(`    ${content}`);
		});
		console.error("");
		console.error("✅ Solution: Use proper type guards or type inference instead of assertions.");
		process.exit(1);
	}

	console.log("✓ No ' as ' type assertions found");
}

await checkAsPattern();
