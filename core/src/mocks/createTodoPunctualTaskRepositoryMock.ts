import type { PunctualTask } from "../entities/PunctualTask";
import type { TodoPunctualTaskRepository } from "../repositories/TodoPunctualTaskRepository";

export function createTodoPunctualTaskRepositoryMock(
	initialTasks: PunctualTask[] = [],
): TodoPunctualTaskRepository {
	let tasks = [...initialTasks];
	const listeners: Array<(tasks: PunctualTask[]) => void> = [];

	function notifyListeners(): void {
		for (const listener of listeners) {
			listener(tasks);
		}
	}

	return {
		getAll: () => tasks,
		getById: (id: string) => tasks.find((task) => task.id === id) ?? null,
		create: (task: PunctualTask) => {
			tasks.push(task);
			notifyListeners();
		},
		update: (task: PunctualTask) => {
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
		observe: (listener: (tasks: PunctualTask[]) => void) => {
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
