import type { TodoContext } from "../contexts/TodoContext";
import { recordAction } from "./recordAction";

export function deleteTask(context: TodoContext, taskId: string): void {
	let task = context.todoRecurringTaskRepository.getById(taskId);
	let isRecurring = true;

	if (!task) {
		task = context.todoPunctualTaskRepository.getById(taskId);
		isRecurring = false;
	}

	if (task) {
		const timestamp = context.timeService.getCurrentTimestamp();

		if (isRecurring) {
			context.todoRecurringTaskRepository.delete(taskId);
		} else {
			context.todoPunctualTaskRepository.delete(taskId);
		}

		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "delete_task",
			taskType: isRecurring ? "recurring" : "punctual",
			timestamp,
			description: `Delete "${task.name}"`,
			previousState: task,
			newState: task,
		});
	}
}
