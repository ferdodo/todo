import type { TodoContext } from "../contexts/TodoContext";
import type { PunctualTask, RecurringTask } from "../entities";
import { recordAction } from "./recordAction";

export function renameTask(context: TodoContext, taskId: string, newName: string): void {
	let recurringTask = context.todoRecurringTaskRepository.getById(taskId);

	if (recurringTask) {
		if (recurringTask.name === newName) return;

		const previousState = recurringTask;
		const newState: RecurringTask = { ...recurringTask, name: newName };
		const timestamp = context.timeService.getCurrentTimestamp();

		context.todoRecurringTaskRepository.update(newState);
		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "rename_task",
			taskType: "recurring",
			timestamp,
			description: `Rename task from "${previousState.name}" to "${newState.name}"`,
			previousState,
			newState,
		});
		return;
	}

	const punctualTask = context.todoPunctualTaskRepository.getById(taskId);
	if (punctualTask) {
		if (punctualTask.name === newName) return;

		const previousState = punctualTask;
		const newState: PunctualTask = { ...punctualTask, name: newName };
		const timestamp = context.timeService.getCurrentTimestamp();

		context.todoPunctualTaskRepository.update(newState);
		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "rename_task",
			taskType: "punctual",
			timestamp,
			description: `Rename task from "${previousState.name}" to "${newState.name}"`,
			previousState,
			newState,
		});
	}
}
