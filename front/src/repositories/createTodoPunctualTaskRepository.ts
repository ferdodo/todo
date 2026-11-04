import type { PunctualTask, TodoPunctualTaskRepository } from "@todo/core";

const STORAGE_KEY = "todo_punctual_tasks";

export function createTodoPunctualTaskRepository(): TodoPunctualTaskRepository {
	const listeners: Array<(tasks: PunctualTask[]) => void> = [];

	const getTasks = (): PunctualTask[] => {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return [];
		const tasks = JSON.parse(data);
		return tasks.map((task: PunctualTask) => ({
			...task,
			weight: task.weight ?? 1,
		}));
	};

	const saveTasks = (tasks: PunctualTask[]): void => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
		listeners.forEach((listener) => {
			listener(tasks);
		});
	};

	return {
		getAll: () => getTasks(),
		getById: (id: string) => {
			const tasks = getTasks();
			return tasks.find((t) => t.id === id) ?? null;
		},
		create: (task: PunctualTask) => {
			const tasks = getTasks();
			tasks.push(task);
			saveTasks(tasks);
		},
		update: (task: PunctualTask) => {
			const tasks = getTasks();
			const index = tasks.findIndex((t) => t.id === task.id);
			if (index !== -1) {
				tasks[index] = task;
				saveTasks(tasks);
			}
		},
		delete: (id: string) => {
			const tasks = getTasks();
			const filtered = tasks.filter((t) => t.id !== id);
			saveTasks(filtered);
		},
		observe: (listener: (tasks: PunctualTask[]) => void) => {
			listeners.push(listener);
			return () => {
				const index = listeners.indexOf(listener);
				if (index !== -1) {
					listeners.splice(index, 1);
				}
			};
		},
	};
}
