import { describe, it, expect } from "vitest";
import { undo } from "./undo";
import { addTask } from "./addTask";
import { doTask } from "./doTask";
import { postponeTask } from "./postponeTask";
import { deleteTask } from "./deleteTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("undo", () => {
	it("should do nothing when no action exists", () => {
		const context = createMockTodoContext();
		undo(context);
		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
	});

	it("should undo a recurring task added via addTask", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);
		const tasksBefore = context.todoRecurringTaskRepository.getAll();
		expect(tasksBefore).toHaveLength(1);
		undo(context);
		const tasksAfter = context.todoRecurringTaskRepository.getAll();
		expect(tasksAfter).toHaveLength(0);
		const redoAction = context.actionHistoryRepository.getRedoAction();
		expect(redoAction).not.toBeNull();
		expect(redoAction?.type).toBe("add_task");
		expect(redoAction?.taskType).toBe("recurring");
	});

	it("should undo a punctual task added via addTask", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);
		const tasksBefore = context.todoPunctualTaskRepository.getAll();
		expect(tasksBefore).toHaveLength(1);
		undo(context);
		const tasksAfter = context.todoPunctualTaskRepository.getAll();
		expect(tasksAfter).toHaveLength(0);
		const redoAction = context.actionHistoryRepository.getRedoAction();
		expect(redoAction).not.toBeNull();
		expect(redoAction?.type).toBe("add_task");
		expect(redoAction?.taskType).toBe("punctual");
	});

it("should restore previousState when undoing a postpone on punctual task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);
		const taskAfterAdd = context.todoPunctualTaskRepository.getAll()[0];
		expect(taskAfterAdd.status).toBe("todo");
		postponeTask(context, taskAfterAdd.id);
		const taskAfterPostpone = context.todoPunctualTaskRepository.getAll()[0];
		expect(taskAfterPostpone.status).toBe("postponed");
		undo(context);
		const taskAfterUndo = context.todoPunctualTaskRepository.getAll()[0];
		expect(taskAfterUndo.status).toBe("todo");
	});

	it("should restore deleted recurring task when undoing deleteTask", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Weekly meeting");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		deleteTask(context, taskId);
		expect(context.todoRecurringTaskRepository.getById(taskId)).toBeNull();

		undo(context);
		const restoredTask = context.todoRecurringTaskRepository.getById(taskId);
		expect(restoredTask).not.toBeNull();
		expect(restoredTask?.name).toBe("Weekly meeting");
	});

	it("should restore deleted punctual task when undoing deleteTask", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Pay bills");
		addTask(context);
		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		deleteTask(context, taskId);
		expect(context.todoPunctualTaskRepository.getById(taskId)).toBeNull();

		undo(context);
		const restoredTask = context.todoPunctualTaskRepository.getById(taskId);
		expect(restoredTask).not.toBeNull();
		expect(restoredTask?.name).toBe("Pay bills");
	});
});
