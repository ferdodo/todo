import { describe, it, expect } from "vitest";
import { postponeTask } from "./postponeTask";
import { addTask } from "./addTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("postponeTask", () => {
	it("should mark a recurring task as postponed", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Code review");
		addTask(context);
		const tasks = context.todoRecurringTaskRepository.getAll();
		const taskId = tasks[0].id;
		postponeTask(context, taskId);
		const updatedTask = context.todoRecurringTaskRepository.getById(taskId);
		expect(updatedTask?.status).toBe("postponed");
		expect(updatedTask?.name).toBe("Code review");

		const history = context.actionHistoryRepository.getHistory();
		const postponeAction = history[1];
		expect(postponeAction.type).toBe("postpone_task");
		expect(postponeAction.taskType).toBe("recurring");
		expect(postponeAction.description).toContain("Code review");
		expect(postponeAction.id).toMatch(/^action-\d+-.+$/);
		expect(postponeAction.id).not.toEqual("");
	});

	it("should mark a punctual task as postponed", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Email client");
		addTask(context);
		const tasks = context.todoPunctualTaskRepository.getAll();
		const taskId = tasks[0].id;
		postponeTask(context, taskId);
		const updatedTask = context.todoPunctualTaskRepository.getById(taskId);
		expect(updatedTask?.status).toBe("postponed");

		const history = context.actionHistoryRepository.getHistory();
		const postponeAction = history[1];
		expect(postponeAction.type).toBe("postpone_task");
		expect(postponeAction.taskType).toBe("punctual");
		expect(postponeAction.description).toContain("Email client");
		expect(postponeAction.id).toMatch(/^action-\d+-.+$/);
		expect(postponeAction.id).not.toEqual("");
	});

	it("should do nothing if task not found", () => {
		const context = createMockTodoContext();
		postponeTask(context, "non-existent");
		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
		expect(context.actionHistoryRepository.getHistory()).toHaveLength(0);
	});
});
