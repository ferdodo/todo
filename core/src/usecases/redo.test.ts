import { describe, it, expect } from "vitest";
import { redo } from "./redo";
import { undo } from "./undo";
import { addTask } from "./addTask";
import { doTask } from "./doTask";
import { postponeTask } from "./postponeTask";
import { changeTaskFormType } from "./changeTaskFormType";
import { renameTaskForm } from "./renameTaskForm";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("redo", () => {
	it("should do nothing when no action exists", () => {
		const context = createMockTodoContext();

		redo(context);

		expect(context.todoRecurringTaskRepository.getAll()).toHaveLength(0);
		expect(context.todoPunctualTaskRepository.getAll()).toHaveLength(0);
	});

	it("should redo a recurring task that was undone", () => {
		const context = createMockTodoContext();

		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Daily standup");
		addTask(context);

		const tasksAfterAdd = context.todoRecurringTaskRepository.getAll();
		expect(tasksAfterAdd).toHaveLength(1);
		const taskId = tasksAfterAdd[0].id;

		undo(context);

		const tasksAfterUndo = context.todoRecurringTaskRepository.getAll();
		expect(tasksAfterUndo).toHaveLength(0);

		redo(context);

		const tasksAfterRedo = context.todoRecurringTaskRepository.getAll();
		expect(tasksAfterRedo).toHaveLength(1);
		expect(tasksAfterRedo[0].id).toBe(taskId);
	});

	it("should redo a punctual task that was undone", () => {
		const context = createMockTodoContext();

		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Buy groceries");
		addTask(context);

		const tasksAfterAdd = context.todoPunctualTaskRepository.getAll();
		expect(tasksAfterAdd).toHaveLength(1);
		const taskId = tasksAfterAdd[0].id;

		undo(context);

		const tasksAfterUndo = context.todoPunctualTaskRepository.getAll();
		expect(tasksAfterUndo).toHaveLength(0);

		redo(context);

		const tasksAfterRedo = context.todoPunctualTaskRepository.getAll();
		expect(tasksAfterRedo).toHaveLength(1);
		expect(tasksAfterRedo[0].id).toBe(taskId);
	});

it("should redo a state change via doTask on recurring task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Code review");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		doTask(context, taskId);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("done");

		undo(context);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("todo");

		redo(context);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("done");
	});

	it("should redo a state change via doTask on punctual task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "punctual");
		renameTaskForm(context, "Send email");
		addTask(context);
		const taskId = context.todoPunctualTaskRepository.getAll()[0].id;

		doTask(context, taskId);
		expect(context.todoPunctualTaskRepository.getById(taskId)?.status).toBe("done");

		undo(context);
		expect(context.todoPunctualTaskRepository.getById(taskId)?.status).toBe("todo");

		redo(context);
		expect(context.todoPunctualTaskRepository.getById(taskId)?.status).toBe("done");
	});

	it("should redo a state change via postponeTask on recurring task", () => {
		const context = createMockTodoContext();
		changeTaskFormType(context, "recurring");
		renameTaskForm(context, "Team meeting");
		addTask(context);
		const taskId = context.todoRecurringTaskRepository.getAll()[0].id;

		postponeTask(context, taskId);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("postponed");

		undo(context);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("todo");

		redo(context);
		expect(context.todoRecurringTaskRepository.getById(taskId)?.status).toBe("postponed");
	});

});
