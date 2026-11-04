import type { TodoContext } from "../contexts/TodoContext";
import type { TimeService } from "../services/TimeService";
import type { ActionHistoryRepository } from "../repositories/ActionHistoryRepository";
import type { HeroRepository } from "../repositories/HeroRepository";
import type { TaskFormRepository } from "../repositories/TaskFormRepository";
import type { Action } from "../entities/Action";
import { Temporal } from "temporal-polyfill";
import { createTodoPunctualTaskRepositoryMock } from "./createTodoPunctualTaskRepositoryMock";
import { createTodoRecurringTaskRepositoryMock } from "./createTodoRecurringTaskRepositoryMock";

function createMockTimeService(): TimeService {
	return {
		getRealDay: () => Temporal.Now.plainDateISO(),
		observeRealDay: (): (() => void) => () => {},
		getCurrentTimestamp: () => Temporal.Now.instant().epochMilliseconds,
	};
}

function createMockActionHistoryRepository(): ActionHistoryRepository {
	const history: Action[] = [];
	let redoStack: Action[] = [];

	return {
		getHistory: () => history,
		getUndoAction: () => (history.length > 0 ? history[history.length - 1] : null),
		getRedoAction: () => (redoStack.length > 0 ? redoStack[redoStack.length - 1] : null),
		pushToHistory: (action: Action): void => {
			history.push(action);
		},
		popHistory: (): Action | null => {
			return history.pop() ?? null;
		},
		pushToRedo: (action: Action): void => {
			redoStack.push(action);
		},
		popRedo: (): Action | null => {
			return redoStack.pop() ?? null;
		},
		clearRedo: (): void => {
			redoStack = [];
		},
		observe: (): (() => void) => () => {},
		observeRedo: (): (() => void) => () => {},
	};
}

function createMockHeroRepository(): HeroRepository {
	return {
		get: () => ({ id: "hero-1", health: 100, level: 1, xp: 0 }),
		update: () => {},
		observe: (): (() => void) => () => {},
	};
}

function createMockTaskFormRepository(): TaskFormRepository {
	let taskForm = { taskType: "recurring" as const, name: "" };
	const listeners: Array<(form: typeof taskForm) => void> = [];

	const notifyListeners = (): void => {
		for (const listener of listeners) {
			listener(taskForm);
		}
	};

	return {
		get: () => taskForm,
		update: (form: typeof taskForm): void => {
			taskForm = form;
			notifyListeners();
		},
		observe: (callback: (form: typeof taskForm) => void): (() => void) => {
			listeners.push(callback);
			callback(taskForm);
			return () => {
				const index = listeners.indexOf(callback);
				if (index > -1) {
					listeners.splice(index, 1);
				}
			};
		},
	};
}

export function createMockTodoContext(): TodoContext {
	return {
		heroRepository: createMockHeroRepository(),
		todoRecurringTaskRepository: createTodoRecurringTaskRepositoryMock(),
		todoPunctualTaskRepository: createTodoPunctualTaskRepositoryMock(),
		taskFormRepository: createMockTaskFormRepository(),
		actionHistoryRepository: createMockActionHistoryRepository(),
		timeService: createMockTimeService(),
	};
}
