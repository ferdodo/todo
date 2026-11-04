import type { TodoContext } from "../contexts/TodoContext";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import type { RecurringTask, PunctualTask, Hero } from "../entities";

export function withHighWeightAverage(): TodoContext {
	const context = createMockTodoContext();

	const hero: Hero = {
		id: "hero-1",
		health: 100,
		level: 1,
		xp: 0,
	};

	// Recurring tasks with high weights to trigger MALUS creation (average > 21)
	const recurringTasks: RecurringTask[] = [
		{ id: "task-1", name: "Task 1", status: "todo", weight: 25 },
		{ id: "task-2", name: "Task 2", status: "todo", weight: 24 },
		{ id: "task-3", name: "Task 3", status: "todo", weight: 24 },
	];

	const punctualTasks: PunctualTask[] = [];

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
	context.todoPunctualTaskRepository.create = (task: PunctualTask): void => {
		punctualTasks.push(task);
	};
	context.todoPunctualTaskRepository.delete = (id: string): void => {
		const index = punctualTasks.findIndex((t) => t.id === id);
		if (index !== -1) punctualTasks.splice(index, 1);
	};

	return context;
}
