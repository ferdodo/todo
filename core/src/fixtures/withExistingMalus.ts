import type { TodoContext } from "../contexts/TodoContext";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import type { RecurringTask, PunctualTask, Hero } from "../entities";

export function withExistingMalus(): TodoContext {
	const context = createMockTodoContext();

	const hero: Hero = {
		id: "hero-1",
		health: 100,
		level: 1,
		xp: 0,
	};

	// Recurring tasks with low weights (average should not be high)
	const recurringTasks: RecurringTask[] = [
		{ id: "task-1", name: "Task 1", status: "todo", weight: 1 },
	];

	// Existing MALUS task that should be deleted
	const punctualTasks: PunctualTask[] = [
		{ id: "malus", name: "MALUS", status: "postponed", weight: 8 },
	];

	context.heroRepository.get = (): Hero => hero;
	context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;
	context.todoRecurringTaskRepository.update = (task: RecurringTask): void => {
		const index = recurringTasks.findIndex((t) => t.id === task.id);
		if (index !== -1) recurringTasks[index] = task;
	};
	context.todoPunctualTaskRepository.getAll = (): PunctualTask[] => punctualTasks;
	context.todoPunctualTaskRepository.update = (task: PunctualTask): void => {
		const index = punctualTasks.findIndex((t) => t.id === task.id);
		if (index !== -1) punctualTasks[index] = task;
	};
	context.todoPunctualTaskRepository.delete = (id: string): void => {
		const index = punctualTasks.findIndex((t) => t.id === id);
		if (index !== -1) punctualTasks.splice(index, 1);
	};

	return context;
}
