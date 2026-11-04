import type { TodoContext } from "../contexts/TodoContext";
import type { PunctualTask, RecurringTask } from "../entities";

export function redo(context: TodoContext): void {
	const action = context.actionHistoryRepository.popRedo();
	if (!action) return;

	context.actionHistoryRepository.pushToHistory(action);

	const newState = action.newState;
	const isRecurring = action.taskType === "recurring";

	switch (action.type) {
		case "add_task":
			if (isRecurring) {
				context.todoRecurringTaskRepository.create(newState as RecurringTask);
			} else {
				context.todoPunctualTaskRepository.create(newState as PunctualTask);
			}
			break;
		case "do_task":
		case "postpone_task":
		case "rename_task":
			if (isRecurring) {
				context.todoRecurringTaskRepository.update(newState as RecurringTask);
			} else {
				context.todoPunctualTaskRepository.update(newState as PunctualTask);
			}
			break;
		case "delete_task":
		case "split_task":
			context.todoRecurringTaskRepository.delete(newState.id);
			context.todoPunctualTaskRepository.delete(newState.id);
			break;
	}
}
