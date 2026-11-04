import type { TodoContext } from "../contexts/TodoContext";
import { recordAction } from "./recordAction";

export function postponeTask(context: TodoContext, taskId: string): void {
	let task = context.todoRecurringTaskRepository.getById(taskId);
	let isRecurring = true;

	if (!task) {
		task = context.todoPunctualTaskRepository.getById(taskId);
		isRecurring = false;
	}

	if (task) {
		const previousState = { ...task };
		const newState = { ...task, status: "postponed" as const };
		const timestamp = context.timeService.getCurrentTimestamp();

		if (isRecurring) {
			context.todoRecurringTaskRepository.update(newState);
		} else {
			context.todoPunctualTaskRepository.update(newState);
		}

		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "postpone_task",
			taskType: isRecurring ? "recurring" : "punctual",
			timestamp,
			description: `Postpone "${task.name}"`,
			previousState,
			newState,
		});
	}
}
