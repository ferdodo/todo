import type { TodoContext } from "../contexts/TodoContext";
import { recordAction } from "./recordAction";

export function doTask(context: TodoContext, taskId: string): void {
	let task = context.todoRecurringTaskRepository.getById(taskId);
	let isRecurring = true;

	if (!task) {
		task = context.todoPunctualTaskRepository.getById(taskId);
		isRecurring = false;
	}

	if (task) {
		const previousState = { ...task };
		const newState = { ...task, status: "done" as const };
		const timestamp = context.timeService.getCurrentTimestamp();

		if (isRecurring) {
			context.todoRecurringTaskRepository.update(newState);
		} else {
			context.todoPunctualTaskRepository.update(newState);
		}

		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "do_task",
			taskType: isRecurring ? "recurring" : "punctual",
			timestamp,
			description: `Mark "${task.name}" as done`,
			previousState,
			newState,
		});
	}
}
