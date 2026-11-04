import { describe, it, expect } from "vitest";
import { renameTask } from "./renameTask";
import { addTask } from "./addTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("renameTask", () => {
	it("should rename a recurring task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		renameTask(context, taskId, "Weekly standup");

		const updatedTask = context.todoRecurringTaskRepository.getById(taskId);
		expect(updatedTask?.name).toBe("Weekly standup");

		const history = context.actionHistoryRepository.getHistory();
		const renameAction = history[1];
		expect(renameAction.type).toBe("rename_task");
		expect(renameAction.taskType).toBe("recurring");
		expect(renameAction.description).toContain("Daily standup");
		expect(renameAction.description).toContain("Weekly standup");
	});

	it("should rename a punctual task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);
		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		renameTask(context, taskId, "Buy groceries and vegetables");

		const updatedTask = context.todoPunctualTaskRepository.getById(taskId);
		expect(updatedTask?.name).toBe("Buy groceries and vegetables");

		const history = context.actionHistoryRepository.getHistory();
		const renameAction = history[1];
		expect(renameAction.type).toBe("rename_task");
		expect(renameAction.taskType).toBe("punctual");
		expect(renameAction.description).toContain("Buy groceries");
		expect(renameAction.description).toContain("Buy groceries and vegetables");
	});

	it("should not record action if task name is unchanged", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		renameTask(context, taskId, "Daily standup");

		const history = context.actionHistoryRepository.getHistory();
		expect(history).toHaveLength(1);
		expect(history[0].type).toBe("add_task");
	});

	it("should do nothing if task not found", () => {
		const context = createMockTodoContext();
		renameTask(context, "non-existent", "New name");

		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
		expect(context.actionHistoryRepository.getHistory()).toHaveLength(0);
	});
});
