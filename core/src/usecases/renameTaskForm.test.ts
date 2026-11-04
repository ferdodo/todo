import { describe, it, expect } from "vitest";
import { renameTaskForm } from "./renameTaskForm";
import type { TaskForm } from "../entities";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("renameTaskForm", () => {
	it("should update the task form name and preserve task type", () => {
		const context = createMockTodoContext();
		let updatedTaskForm: TaskForm | null = null;

		const currentTaskForm: TaskForm = {
			taskType: "recurring",
			name: "Old name",
		};

		context.taskFormRepository.get = (): TaskForm => currentTaskForm;
		context.taskFormRepository.update = (taskForm: TaskForm): void => {
			updatedTaskForm = taskForm;
		};

		renameTaskForm(context, "New name");

		expect(updatedTaskForm).toEqual({
			taskType: "recurring",
			name: "New name",
		});
	});
});
