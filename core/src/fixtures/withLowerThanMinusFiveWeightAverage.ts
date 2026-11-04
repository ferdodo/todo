import type { TodoContext } from "../contexts/TodoContext";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import type { RecurringTask, PunctualTask, Hero } from "../entities";
import { generateRecurringTaskWithWeightLowerThanFive } from "../factories/generateRecurringTaskWithWeightLowerThanFive";
import { generatePunctualTaskWithWeightLowerThanFive } from "../factories/generatePunctualTaskWithWeightLowerThanFive";

export function withLowerThanMinusFiveWeightAverage(): TodoContext {
	const context = createMockTodoContext();

	const hero: Hero = {
		id: "hero-1",
		health: 100,
		level: 1,
		xp: 0,
	};

	// Recurring tasks with random weights < -5 average
	const recurringTasks = [
		generateRecurringTaskWithWeightLowerThanFive(),
		generateRecurringTaskWithWeightLowerThanFive(),
	];

	// Punctual tasks with random weights < -5 average
	const punctualTasks = [
		generatePunctualTaskWithWeightLowerThanFive(),
		generatePunctualTaskWithWeightLowerThanFive(),
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

	return context;
}
