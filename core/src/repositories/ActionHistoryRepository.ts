import type { Action } from "../entities/Action";

export interface ActionHistoryRepository {
	getHistory(): Action[];
	getUndoAction(): Action | null;
	getRedoAction(): Action | null;
	pushToHistory(action: Action): void;
	popHistory(): Action | null;
	pushToRedo(action: Action): void;
	popRedo(): Action | null;
	clearRedo(): void;
	observe(listener: (history: Action[]) => void): () => void;
	observeRedo(listener: (redoStack: Action[]) => void): () => void;
}
