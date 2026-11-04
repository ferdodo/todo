import type { TodoContext } from "../contexts/TodoContext";
import type { Action } from "../entities/Action";

export function recordAction(context: TodoContext, action: Action): void {
	context.actionHistoryRepository.pushToHistory(action);
	context.actionHistoryRepository.clearRedo();
}
