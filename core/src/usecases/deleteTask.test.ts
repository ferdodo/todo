import { describe, it, expect } from "vitest";
import { deleteTask } from "./deleteTask";
import { addTask } from "./addTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("deleteTask", () => {
	it("should delete a punctual task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Test task");
		addTask(context);
		const tasks = context.todoPunctualTaskRepository.getAll();
		expect(tasks).toHaveLength(1);
		const taskId = tasks[0].id;
		deleteTask(context, taskId);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
	});

	it("should delete a recurring task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const tasks = context.todoRecurringTaskRepository.getAll();
		expect(tasks).toHaveLength(1);
		const taskId = tasks[0].id;
		deleteTask(context, taskId);
		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
	});

	it("should not record action when task does not exist", () => {
		const context = createMockTodoContext();
		deleteTask(context, "nonexistent-id");
		expect(context.actionHistoryRepository.getHistory()).toHaveLength(0);
	});

	it("should record action with correct content for recurring task deletion", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Code review");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		deleteTask(context, taskId);

		const history = context.actionHistoryRepository.getHistory();
		expect(history).toHaveLength(2); // addTask action + deleteTask action
		const deleteAction = history[1];
		expect(deleteAction.type).toBe("delete_task");
		expect(deleteAction.taskType).toBe("recurring");
		expect(deleteAction.description).toContain("Code review");
	});

	it("should record action with correct content for punctual task deletion", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Send report");
		addTask(context);
		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		deleteTask(context, taskId);

		const history = context.actionHistoryRepository.getHistory();
		expect(history).toHaveLength(2); // addTask action + deleteTask action
		const deleteAction = history[1];
		expect(deleteAction.type).toBe("delete_task");
		expect(deleteAction.taskType).toBe("punctual");
		expect(deleteAction.description).toContain("Send report");
	});
});
