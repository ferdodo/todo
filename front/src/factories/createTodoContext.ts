import type { TodoContext } from "@todo/core";
import { createTimeService } from "@todo/browser";
import { createTodoRecurringTaskRepository } from "../repositories/createTodoRecurringTaskRepository";
import { createTodoPunctualTaskRepository } from "../repositories/createTodoPunctualTaskRepository";
import { createHeroRepository } from "../repositories/createHeroRepository";
import { createTaskFormRepository } from "../repositories/createTaskFormRepository";
import { createActionHistoryRepository } from "../repositories/createActionHistoryRepository";

export function createTodoContext(): TodoContext {
	return {
		todoRecurringTaskRepository: createTodoRecurringTaskRepository(),
		todoPunctualTaskRepository: createTodoPunctualTaskRepository(),
		heroRepository: createHeroRepository(),
		taskFormRepository: createTaskFormRepository(),
		actionHistoryRepository: createActionHistoryRepository(),
		timeService: createTimeService(),
	};
}
