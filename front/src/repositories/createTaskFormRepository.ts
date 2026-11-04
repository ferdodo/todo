import type { TaskFormRepository, TaskForm } from "@todo/core";

export function createTaskFormRepository(): TaskFormRepository {
	let taskForm: TaskForm = { taskType: "recurring", name: "" };
	const subscribers: ((taskForm: TaskForm) => void)[] = [];

	const notifySubscribers = (): void => {
		subscribers.forEach((callback) => {
			callback(taskForm);
		});
	};

	return {
		get(): TaskForm {
			return taskForm;
		},
		update(newTaskForm: TaskForm): void {
			taskForm = newTaskForm;
			notifySubscribers();
		},
		observe(callback: (taskForm: TaskForm) => void): () => void {
			subscribers.push(callback);
			return () => {
				const index = subscribers.indexOf(callback);
				if (index !== -1) {
					subscribers.splice(index, 1);
				}
			};
		},
	};
}
