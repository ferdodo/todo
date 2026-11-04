import type { RecurringTask } from "../entities/RecurringTask";
import type { TodoRecurringTaskRepository } from "../repositories/TodoRecurringTaskRepository";

export function createTodoRecurringTaskRepositoryMock(
	initialTasks: RecurringTask[] = [],
): TodoRecurringTaskRepository {
	let tasks = [...initialTasks];
	const listeners: Array<(tasks: RecurringTask[]) => void> = [];

	function notifyListeners(): void {
		for (const listener of listeners) {
			listener(tasks);
		}
	}

	return {
		getAll: () => tasks,
		getById: (id: string) => tasks.find((task) => task.id === id) ?? null,
		create: (task: RecurringTask) => {
			tasks.push(task);
			notifyListeners();
		},
		update: (task: RecurringTask) => {
			const index = tasks.findIndex((t) => t.id === task.id);
			if (index !== -1) {
				tasks[index] = task;
				notifyListeners();
			}
		},
		delete: (id: string) => {
			tasks = tasks.filter((task) => task.id !== id);
			notifyListeners();
		},
		observe: (listener: (tasks: RecurringTask[]) => void) => {
			listeners.push(listener);
			listener(tasks);
			return () => {
				const index = listeners.indexOf(listener);
				if (index > -1) {
					listeners.splice(index, 1);
				}
			};
		},
	};
}
