import type { TaskForm } from "../entities";

export interface TaskFormRepository {
	get(): TaskForm;
	update(taskForm: TaskForm): void;
	observe(callback: (taskForm: TaskForm) => void): () => void;
}
