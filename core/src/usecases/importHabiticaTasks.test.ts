import { describe, it, expect } from "vitest";
import { importHabiticaTasks } from "./importHabiticaTasks";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import { createMockBrowserService } from "../mocks/createMockBrowserService";

describe("importHabiticaTasks", () => {
	it("should import recurring task A correctly", async () => {
		const context = createMockTodoContext();
		const mockBrowserService = createMockBrowserService();
		const result = await importHabiticaTasks(mockBrowserService, context);
		expect(result.imported).toBe(4);
		expect(result.errors).toHaveLength(0);
		const recurringTasks = context.todoRecurringTaskRepository.getAll();
		expect(recurringTasks[0].name).toBe("Recurrent A");
		expect(recurringTasks[0].status).toBe("todo");
		expect(recurringTasks[0].id).toContain("recurring");
	});

	it("should import punctual task A correctly", async () => {
		const context = createMockTodoContext();
		const mockBrowserService = createMockBrowserService();
		await importHabiticaTasks(mockBrowserService, context);
		const punctualTasks = context.todoPunctualTaskRepository.getAll();
		expect(punctualTasks[0].name).toBe("Punctual A");
		expect(punctualTasks[0].id).toContain("punctual");
	});
});
