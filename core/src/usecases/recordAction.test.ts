import { describe, it, expect } from "vitest";
import { recordAction } from "./recordAction";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import type { Action } from "../entities/Action";
import type { PunctualTask } from "../entities";

describe("recordAction", () => {
	it("should push action and clear redo queue", () => {
		const context = createMockTodoContext();
		const newState: PunctualTask = { id: "1", name: "Task", status: "todo", weight: 1 };
		const action: Action = {
			id: "test-action-1",
			type: "add_task",
			taskType: "punctual",
			description: "Test action",
			newState,
			timestamp: 123456,
		};

		recordAction(context, action);

		expect(context.actionHistoryRepository.getHistory()).toHaveLength(1);
		expect(context.actionHistoryRepository.getRedoAction()).toBeNull();
	});
});
