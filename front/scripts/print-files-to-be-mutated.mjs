#!/usr/bin/env node
import { execSync } from 'node:child_process';

async function getCurrentStagedFiles() {
	const result = execSync('git diff --cached --name-only --relative .', { stdio: 'pipe' });
	return result.toString().split('\n').filter(Boolean);
}

async function getUnstagedFiles() {
	const result = execSync('git diff --name-only --relative .', { stdio: 'pipe' });
	return result.toString().split('\n').filter(Boolean);
}

async function getModifiedFilesInLastCommit() {
	const result = execSync('git diff HEAD^ --name-only --relative .', { stdio: 'pipe' });
	return result.toString().split('\n').filter(Boolean);
}

async function getFilesToMutate() {
	return Promise.all(
		[getCurrentStagedFiles(), getUnstagedFiles(), getModifiedFilesInLastCommit()]
	).then(([stagedFiles, unstagedFiles, lastCommitFiles]) => {
		const modifiedFiles = new Set([...stagedFiles, ...unstagedFiles]);

		if (modifiedFiles.size === 0) {
			modifiedFiles.add(...lastCommitFiles);
		}

		return [...modifiedFiles].filter(Boolean).filter(v => v.endsWith('.ts') && !v.includes('test.ts')).filter(v => !v.includes('/hooks/')).filter(v => !v.includes('/constants/')).filter(v => !v.includes('/repositories/')).filter(v => !v.includes('/factories/')).filter(v => !v.includes('/contexts/'));
	});
}

async function printFilesToBeMutated() {
	const filesToMutate = await getFilesToMutate();
	
	filesToMutate.forEach(file => {
		console.log(file);
	});
}

printFilesToBeMutated();

