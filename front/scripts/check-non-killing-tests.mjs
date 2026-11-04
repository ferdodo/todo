#!/usr/bin/env node
import fs from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPORT_PATH = "public/stryker-report.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilesToMutate() {
	const scriptPath = join(__dirname, "print-files-to-be-mutated.mjs");
	const result = execSync(`node ${scriptPath}`, { stdio: "pipe", encoding: "utf8" });
	return result.toString().split("\n").filter(Boolean);
}

function getTestFilePathFromSourceFile(sourceFile) {
	return sourceFile.replace(/\.ts$/, ".test.ts");
}

function analyzeStrykerReport() {
	console.log("🔍 Analyse du rapport Stryker...\n");

	if (!fs.existsSync(REPORT_PATH)) {
		console.error("Rapport Stryker non trouvé:", REPORT_PATH);
		process.exit(0);
	}

	try {
		const filesToMutate = getFilesToMutate();
		const testFilesToCheck = new Set(
			filesToMutate.map((file) => getTestFilePathFromSourceFile(file)),
		);

		const reportContent = fs.readFileSync(REPORT_PATH, "utf8");
		const report = JSON.parse(reportContent);

		console.log("📊 Statistiques du rapport:");
		const filesArray = Object.values(report.files || {});
		console.log(`   - Fichiers analysés: ${filesArray.length}`);

		const totalMutants = filesArray.reduce(
			(total, file) => total + (file.mutants?.length || 0),
			0,
		);
		console.log(`   - Mutants totaux: ${totalMutants}`);

		const survivedMutants = [];
		const allTestIds = new Set();
		const allKillingTestIds = new Set();

		// Parcourir testFiles directement et créer un map des tests
		const testMap = new Map();
		if (report.testFiles) {
			Object.entries(report.testFiles).forEach(([testFilePath, testFile]) => {
				if (testFile.tests) {
					testFile.tests.forEach((test) => {
						allTestIds.add(test.id);
						testMap.set(test.id, {
							name: test.name,
							file: testFilePath,
						});
					});
				}
			});
		}

		// Parcourir tous les mutants pour récupérer les IDs des tests qui tuent
		filesArray.forEach((file) => {
			if (file.mutants) {
				file.mutants.forEach((mutant) => {
					if (mutant.status === "Survived") {
						survivedMutants.push(mutant);
					}
					if (mutant.status === "Killed" && mutant.killedBy) {
						// Un mutant peut être tué par plusieurs tests
						mutant.killedBy.forEach((killingTest) => {
							allKillingTestIds.add(killingTest);
						});
					}
				});
			}
		});

		console.log(`   - Mutants survivants: ${survivedMutants.length}`);
		console.log(`   - Tests identifiés: ${allTestIds.size}`);
		console.log(`   - Tests qui tuent: ${allKillingTestIds.size}\n`);

		const testKillCount = new Map();

		filesArray.forEach((file) => {
			if (file.mutants) {
				file.mutants.forEach((mutant) => {
					if (mutant.status === "Killed" && mutant.killedBy) {
						mutant.killedBy.forEach((killingTestId) => {
							testKillCount.set(
								killingTestId,
								(testKillCount.get(killingTestId) || 0) + 1,
							);
						});
					}
				});
			}
		});

		const allNonKillingTests = Array.from(allTestIds).filter(
			(testId) => !testKillCount.has(testId) || testKillCount.get(testId) === 0,
		);

		// Filtrer les tests pour ne garder que ceux correspondant aux fichiers à muter
		const relevantTestIds = Array.from(allTestIds).filter((testId) => {
			const testInfo = testMap.get(testId);
			if (!testInfo) return false;
			return testFilesToCheck.has(testInfo.file);
		});

		// Filtrer les tests non-killing pour ne garder que ceux correspondant aux fichiers à muter
		const nonKillingTests = allNonKillingTests.filter((testId) => {
			const testInfo = testMap.get(testId);
			if (!testInfo) return false;
			return testFilesToCheck.has(testInfo.file);
		});

		const relevantKillingTestIds = Array.from(allKillingTestIds).filter(
			(testId) => {
				const testInfo = testMap.get(testId);
				if (!testInfo) return false;
				return testFilesToCheck.has(testInfo.file);
			},
		);

		console.log("\n📊 COMPARAISON:");
		console.log(`   - Nombre total de tests: ${allTestIds.size}`);
		console.log(`   - Nombre de tests qui tuent: ${allKillingTestIds.size}`);
		console.log(`   - Tests non-killing (tous): ${allNonKillingTests.length}`);
		console.log(
			`   - Tests pertinents (fichiers mutés): ${relevantTestIds.length}`,
		);
		console.log(
			`   - Tests qui tuent (fichiers mutés): ${relevantKillingTestIds.length}`,
		);
		console.log(
			`   - Tests non-killing (fichiers mutés): ${nonKillingTests.length}`,
		);

		if (nonKillingTests.length > 0) {
			console.log("\n🚨 TESTS NON-KILLING DÉTECTÉS:");
			console.log("   Ces tests ne tuent aucun mutant et doivent être supprimés:\n");

			nonKillingTests.forEach((testId) => {
				const killCount = testKillCount.get(testId) || 0;
				const testInfo = testMap.get(testId);
				const testName = testInfo ? testInfo.name : "Nom inconnu";
				const testFile = testInfo ? testInfo.file : "Fichier inconnu";
				console.log(
					`   ❌ Test ID: ${testId} (tue ${killCount} mutant${killCount > 1 ? "s" : ""})`,
				);
				console.log(`      📝 Nom: ${testName}`);
				console.log(`      📁 Fichier: ${testFile}\n`);
			});

			console.log(`\n📊 Résumé:`);
			console.log(`   - Tests non-killing: ${nonKillingTests.length}`);
			const effectiveTests = relevantTestIds.length - nonKillingTests.length;
			console.log(`   - Tests efficaces: ${effectiveTests}`);
			const efficiencyRate =
				relevantTestIds.length > 0
					? Math.round((effectiveTests / relevantTestIds.length) * 100)
					: 100;
			console.log(`   - Taux d'efficacité: ${efficiencyRate}%`);

			console.log("\n💡 Action requise:");
			console.log("   - Supprimez les tests listés ci-dessus.");
			console.log("   - Un test qui ne tue aucun mutant est redondant : il ne vérifie");
			console.log("     rien que les autres tests ne vérifient déjà.");

			console.log("\n❌ ÉCHEC: Des tests non-killing ont été détectés");
			process.exit(1);
		} else {
			const effectiveTests = relevantTestIds.length;
			console.log("\n✅ SUCCÈS: Tous les tests pertinents tuent au moins un mutant");
			console.log(
				`📊 Taux d'efficacité: 100% (${effectiveTests} test${effectiveTests > 1 ? "s" : ""} efficace${effectiveTests > 1 ? "s" : ""})`,
			);
			process.exit(0);
		}
	} catch (error) {
		console.error("❌ Erreur lors de l'analyse du rapport:", error.message);
		process.exit(1);
	}
}

analyzeStrykerReport();
