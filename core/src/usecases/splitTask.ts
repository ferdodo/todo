import type { TodoContext } from "../contexts/TodoContext";
import { recordAction } from "./recordAction";

function generatePunctualId(): string {
	return `punctual-task-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 9)}`;
}

export function splitTask(
	context: TodoContext,
	taskId: string,
	newTaskName: string,
): void {
	const allTasks = context.todoPunctualTaskRepository.getAll();
	const task = allTasks.find((t) => t.id === taskId);
	if (!task) {
		return;
	}

	const originalWeight = task.weight;
	const newTaskWeight = originalWeight * 0.7;
	const remainingWeight = originalWeight * 0.3;

	const timestamp = context.timeService.getCurrentTimestamp();

	const newTask = {
		id: generatePunctualId(),
		name: newTaskName,
		status: "todo" as const,
		weight: newTaskWeight,
	};

	context.todoPunctualTaskRepository.create(newTask);

	const updatedOriginalTask = { ...task, weight: remainingWeight };
	context.todoPunctualTaskRepository.update(updatedOriginalTask);

	recordAction(context, {
		id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
		type: "split_task",
		taskType: "punctual",
		timestamp,
		description: `Split task "${task.name}" into "${newTaskName}"`,
		newState: newTask,
	});
}
