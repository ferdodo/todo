import type { TodoContext } from "../contexts/TodoContext";
import type { Action } from "../entities/Action";

export function getLastAction(context: TodoContext): Action | null {
	return context.actionHistoryRepository.getUndoAction();
}
