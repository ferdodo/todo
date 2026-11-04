import { describe, it, expect } from "vitest";
import { splitTask } from "./splitTask";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { addTask } from "./addTask";

describe("splitTask", () => {
	it("should create a new task with 70% of original weight", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Original Task");
		addTask(context);

		const tasks = context.todoPunctualTaskRepository.getAll();
		expect(tasks).toHaveLength(1);
		const taskId = tasks[0].id;

		splitTask(context, taskId, "New Task");

		const updatedTasks = context.todoPunctualTaskRepository.getAll();
		expect(updatedTasks).toHaveLength(2);

		const newTask = updatedTasks.find((t) => t.name === "New Task");
		expect(newTask?.weight).toBe(0.7);
		expect(newTask?.status).toBe("todo");
	});

	it("should update original task to 30% of original weight", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Original Task");
		addTask(context);

		const tasks = context.todoPunctualTaskRepository.getAll();
		const taskId = tasks[0].id;

		splitTask(context, taskId, "New Task");

		const updatedTasks = context.todoPunctualTaskRepository.getAll();
		const originalTask = updatedTasks.find((t) => t.id === taskId);
		expect(originalTask?.weight).toBe(0.3);
		expect(originalTask?.name).toBe("Original Task");
	});

	it("should record split_task action with correct description", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Original Task");
		addTask(context);

		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		splitTask(context, taskId, "New Task");

		const actions = context.actionHistoryRepository.getHistory();
		const splitAction = actions.find((a) => a.type === "split_task");

		expect(splitAction?.type).toBe("split_task");
		expect(splitAction?.taskType).toBe("punctual");
		expect(splitAction?.description).toBe('Split task "Original Task" into "New Task"');
	});

	it("should handle non-existent task gracefully", () => {
		const context = createMockTodoContext();
		const initialTasks = context.todoPunctualTaskRepository.getAll().length;
		splitTask(context, "nonexistent-id", "New Task");
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(initialTasks);
	});

	it("should split the correct task when multiple tasks exist", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "First Task");
		addTask(context);
		renameTaskForm(context, "Second Task");
		addTask(context);
		renameTaskForm(context, "Third Task");
		addTask(context);

		const allTasksBeforeSplit = context.todoPunctualTaskRepository.getAll();
		expect(allTasksBeforeSplit).toHaveLength(3);

		const secondTaskId = allTasksBeforeSplit[1].id;
		const originalWeight = allTasksBeforeSplit[1].weight;

		splitTask(context, secondTaskId, "Second Task Split");

		const allTasksAfterSplit = context.todoPunctualTaskRepository.getAll();
		expect(allTasksAfterSplit).toHaveLength(4);

		const firstTask = allTasksAfterSplit.find((t) => t.name === "First Task");
		const secondTask = allTasksAfterSplit.find((t) => t.id === secondTaskId);
		const secondTaskSplit = allTasksAfterSplit.find((t) => t.name === "Second Task Split");
		const thirdTask = allTasksAfterSplit.find((t) => t.name === "Third Task");

		expect(firstTask?.weight).toBe(1);
		expect(secondTask?.weight).toBe(originalWeight * 0.3);
		expect(secondTaskSplit?.weight).toBe(originalWeight * 0.7);
		expect(thirdTask?.weight).toBe(1);
	});

	it("should generate unique IDs for split tasks", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Original Task");
		addTask(context);

		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		splitTask(context, taskId, "First Split");
		splitTask(context, taskId, "Second Split");

		const allTasks = context.todoPunctualTaskRepository.getAll();
		const ids = allTasks.map((t) => t.id);
		const uniqueIds = new Set(ids);

		expect(ids.length).toBe(uniqueIds.size);
		ids.forEach((id) => {
			expect(id).toBeTruthy();
			expect(id.length).toBeGreaterThan(0);
		});
	});
});
