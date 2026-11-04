import type { RecurringTask } from "../entities";

export interface TodoRecurringTaskRepository {
	getAll(): RecurringTask[];
	getById(id: string): RecurringTask | null;
	create(task: RecurringTask): void;
	update(task: RecurringTask): void;
	delete(id: string): void;
	observe(listener: (tasks: RecurringTask[]) => void): () => void;
}
