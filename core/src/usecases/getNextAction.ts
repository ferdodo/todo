import type { TodoContext } from "../contexts/TodoContext";
import type { Action } from "../entities/Action";

export function getNextAction(context: TodoContext): Action | null {
	return context.actionHistoryRepository.getRedoAction();
}
