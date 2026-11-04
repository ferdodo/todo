import { describe, it, expect } from "vitest";
import { doTask } from "./doTask";
import { addTask } from "./addTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("doTask", () => {
	it("should mark a recurring task as done", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const tasks = context.todoRecurringTaskRepository.getAll();
		const taskId = tasks[0].id;
		doTask(context, taskId);
		const updatedTask = context.todoRecurringTaskRepository.getById(taskId);
		expect(updatedTask?.status).toBe("done");
		expect(updatedTask?.name).toBe("Daily standup");

		const history = context.actionHistoryRepository.getHistory();
		const doAction = history[1];
		expect(doAction.type).toBe("do_task");
		expect(doAction.taskType).toBe("recurring");
		expect(doAction.description).toContain("Daily standup");
		expect(doAction.id).toMatch(/^action-\d+-.+$/);
		expect(doAction.id).not.toEqual("");
	});

	it("should mark a punctual task as done", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);
		const tasks = context.todoPunctualTaskRepository.getAll();
		const taskId = tasks[0].id;
		doTask(context, taskId);
		const updatedTask = context.todoPunctualTaskRepository.getById(taskId);
		expect(updatedTask?.status).toBe("done");

		const history = context.actionHistoryRepository.getHistory();
		const doAction = history[1];
		expect(doAction.type).toBe("do_task");
		expect(doAction.taskType).toBe("punctual");
		expect(doAction.description).toContain("Buy groceries");
		expect(doAction.id).toMatch(/^action-\d+-.+$/);
		expect(doAction.id).not.toEqual("");
	});

	it("should do nothing if task not found", () => {
		const context = createMockTodoContext();
		doTask(context, "non-existent");
		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
		expect(context.actionHistoryRepository.getHistory()).toHaveLength(0);
	});
});
