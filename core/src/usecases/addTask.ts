import type { RecurringTask, PunctualTask } from "../entities";
import type { TodoContext } from "../contexts/TodoContext";
import { recordAction } from "./recordAction";

let recurringIdCounter = 0;
let punctualIdCounter = 0;

function generateRecurringId(): string {
	recurringIdCounter += 1;
	return `recurring-task-${recurringIdCounter}-${Math.random().toString(36).substring(2, 9)}`;
}

function generatePunctualId(): string {
	punctualIdCounter += 1;
	return `punctual-task-${punctualIdCounter}-${Math.random().toString(36).substring(2, 9)}`;
}

export function addTask(context: TodoContext): void {
	const taskForm = context.taskFormRepository.get();
	const timestamp = context.timeService.getCurrentTimestamp();

	if (taskForm.taskType === "recurring") {
		const task: RecurringTask = {
			id: generateRecurringId(),
			name: taskForm.name,
			status: "todo",
			weight: 1,
		};
		context.todoRecurringTaskRepository.create(task);
		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "add_task",
			taskType: "recurring",
			timestamp,
			description: `Add recurring task "${task.name}"`,
			newState: task,
		});
	} else {
		const task: PunctualTask = {
			id: generatePunctualId(),
			name: taskForm.name,
			status: "todo",
			weight: 1,
		};
		context.todoPunctualTaskRepository.create(task);
		recordAction(context, {
			id: `action-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
			type: "add_task",
			taskType: "punctual",
			timestamp,
			description: `Add punctual task "${task.name}"`,
			newState: task,
		});
	}
}
