import { describe, it, expect } from "vitest";
import { addTask } from "./addTask";
import { renameTaskForm } from "./renameTaskForm";
import { changeTaskFormType } from "./changeTaskFormType";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("addTask", () => {
	it("should create a recurring task from task form", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const tasks = context.todoRecurringTaskRepository.getAll();
		expect(tasks).toHaveLength(1);
		expect(tasks[0].name).toBe("Daily standup");
		expect(tasks[0].status).toBe("todo");
		expect(tasks[0].id).toMatch(/^recurring-task-\d+-[a-z0-9]+$/);

		const history = context.actionHistoryRepository.getHistory();
		const addAction = history[0];
		expect(addAction.type).toBe("add_task");
		expect(addAction.taskType).toBe("recurring");
		expect(addAction.description).toContain("Daily standup");
		expect(addAction.id).toMatch(/^action-\d+-.+$/);
		expect(addAction.id).not.toEqual("");
	});

	it("should create a punctual task from task form", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);
		const tasks = context.todoPunctualTaskRepository.getAll();
		expect(tasks).toHaveLength(1);
		expect(tasks[0].name).toBe("Buy groceries");
		expect(tasks[0].id).toMatch(/^punctual-task-\d+-[a-z0-9]+$/);

		const history = context.actionHistoryRepository.getHistory();
		const addAction = history[0];
		expect(addAction.type).toBe("add_task");
		expect(addAction.taskType).toBe("punctual");
		expect(addAction.description).toContain("Buy groceries");
		expect(addAction.id).toMatch(/^action-\d+-.+$/);
		expect(addAction.id).not.toEqual("");
	});
});
