import type { PunctualTask } from "../entities";

export interface TodoPunctualTaskRepository {
	getAll(): PunctualTask[];
	getById(id: string): PunctualTask | null;
	create(task: PunctualTask): void;
	update(task: PunctualTask): void;
	delete(id: string): void;
	observe(listener: (tasks: PunctualTask[]) => void): () => void;
}
