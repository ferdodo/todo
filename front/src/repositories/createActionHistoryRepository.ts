import type { Action, ActionHistoryRepository } from "../../../core/src";

const HISTORY_STORAGE_KEY = "action_history";
const REDO_STORAGE_KEY = "action_redo";
const MAX_HISTORY_SIZE = 10;

export function createActionHistoryRepository(): ActionHistoryRepository {
	const historyListeners: Array<(history: Action[]) => void> = [];
	const redoListeners: Array<(redoStack: Action[]) => void> = [];

	function getHistory(): Action[] {
		const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	}

	function getRedo(): Action[] {
		const stored = localStorage.getItem(REDO_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	}

	function saveHistory(history: Action[]): void {
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
		for (const listener of historyListeners) {
			listener(history);
		}
	}

	function saveRedo(redo: Action[]): void {
		localStorage.setItem(REDO_STORAGE_KEY, JSON.stringify(redo));
		for (const listener of redoListeners) {
			listener(redo);
		}
	}

	return {
		getHistory,
		getUndoAction(): Action | null {
			const history = getHistory();
			return history.length > 0 ? history[history.length - 1] : null;
		},
		getRedoAction(): Action | null {
			const redo = getRedo();
			return redo.length > 0 ? redo[redo.length - 1] : null;
		},
		pushToHistory(action: Action): void {
			const history = getHistory();
			history.push(action);
			if (history.length > MAX_HISTORY_SIZE) {
				history.shift();
			}
			saveHistory(history);
		},
		popHistory(): Action | null {
			const history = getHistory();
			const action = history.pop();
			if (action) {
				saveHistory(history);
			}
			return action || null;
		},
		pushToRedo(action: Action): void {
			const redo = getRedo();
			redo.push(action);
			saveRedo(redo);
		},
		popRedo(): Action | null {
			const redo = getRedo();
			const action = redo.pop();
			if (action) {
				saveRedo(redo);
			}
			return action || null;
		},
		clearRedo(): void {
			saveRedo([]);
		},
		observe(listener: (history: Action[]) => void): () => void {
			historyListeners.push(listener);
			listener(getHistory());
			return () => {
				const index = historyListeners.indexOf(listener);
				if (index > -1) {
					historyListeners.splice(index, 1);
				}
			};
		},
		observeRedo(listener: (redoStack: Action[]) => void): () => void {
			redoListeners.push(listener);
			listener(getRedo());
			return () => {
				const index = redoListeners.indexOf(listener);
				if (index > -1) {
					redoListeners.splice(index, 1);
				}
			};
		},
	};
}
