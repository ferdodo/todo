import type { HeroRepository } from "../repositories/HeroRepository";
import type { TodoPunctualTaskRepository } from "../repositories/TodoPunctualTaskRepository";
import type { TodoRecurringTaskRepository } from "../repositories/TodoRecurringTaskRepository";
import type { TaskFormRepository } from "../repositories/TaskFormRepository";
import type { ActionHistoryRepository } from "../repositories/ActionHistoryRepository";
import type { TimeService } from "../services/TimeService";

export interface TodoContext {
	heroRepository: HeroRepository;
	todoRecurringTaskRepository: TodoRecurringTaskRepository;
	todoPunctualTaskRepository: TodoPunctualTaskRepository;
	taskFormRepository: TaskFormRepository;
	actionHistoryRepository: ActionHistoryRepository;
	timeService: TimeService;
}
