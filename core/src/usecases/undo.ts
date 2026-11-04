import type { TodoContext } from "../contexts/TodoContext";
import type { PunctualTask, RecurringTask } from "../entities";

export function undo(context: TodoContext): void {
	const action = context.actionHistoryRepository.popHistory();
	if (!action) return;

	context.actionHistoryRepository.pushToRedo(action);

	const isRecurring = action.taskType === "recurring";

	switch (action.type) {
		case "delete_task":
			if (action.previousState) {
				if (isRecurring) {
					context.todoRecurringTaskRepository.create(
						action.previousState as RecurringTask,
					);
				} else {
					context.todoPunctualTaskRepository.create(
						action.previousState as PunctualTask,
					);
				}
			}
			break;
		case "add_task":
			if (isRecurring) {
				context.todoRecurringTaskRepository.delete(action.newState.id);
			} else {
				context.todoPunctualTaskRepository.delete(action.newState.id);
			}
			break;
		case "do_task":
		case "postpone_task":
		case "rename_task":
		case "split_task":
			if (action.previousState) {
				if (isRecurring) {
					context.todoRecurringTaskRepository.update(
						action.previousState as RecurringTask,
					);
				} else {
					context.todoPunctualTaskRepository.update(
						action.previousState as PunctualTask,
					);
				}
			}
			break;
	}
}
