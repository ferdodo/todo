import { describe, it, expect } from "vitest";
import { exportTasks } from "./exportTasks";
import { importHabiticaTasks } from "./importHabiticaTasks";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import { createMockBrowserService } from "../mocks/createMockBrowserService";
import type { RecurringTask, PunctualTask, Hero } from "../entities";
import type { BrowserService } from "../services/BrowserService";

describe("exportTasks", () => {
	it("should export tasks with weight, status, and hero stats", () => {
		const context = createMockTodoContext();

		const hero: Hero = {
			id: "hero-1",
			health: 75,
			level: 3,
			xp: 42,
		};

		const recurringTasks: RecurringTask[] = [
			{ id: "r1", name: "Daily 1", status: "todo", weight: 2 },
			{ id: "r2", name: "Daily 2", status: "done", weight: -1 },
		];

		const punctualTasks: PunctualTask[] = [
			{ id: "p1", name: "Todo 1", status: "todo", weight: 1 },
			{ id: "p2", name: "Todo 2", status: "postponed", weight: 3 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;
		context.todoPunctualTaskRepository.getAll = (): PunctualTask[] => punctualTasks;

		const exported = exportTasks(context);
		const data = JSON.parse(exported);

		expect(data.tasks.dailys).toHaveLength(2);
		expect(data.tasks.todos).toHaveLength(2);
		expect(data.hero).toEqual({ health: 75, level: 3, xp: 42 });

		expect(data.tasks.dailys[0]).toEqual({
			text: "Daily 1",
			type: "daily",
			weight: 2,
			status: "todo",
		});

		expect(data.tasks.todos[1]).toEqual({
			text: "Todo 2",
			type: "todo",
			weight: 3,
			status: "postponed",
		});
	});

	it("should round-trip: export from context1, import to context2, and both should match", async () => {
		const context1 = createMockTodoContext();
		const context2 = createMockTodoContext();

		const hero1: Hero = {
			id: "hero-1",
			health: 85,
			level: 5,
			xp: 67,
		};

		const recurringTasks1: RecurringTask[] = [
			{ id: "r1", name: "Morning Run", status: "todo", weight: 2 },
			{ id: "r2", name: "Read", status: "postponed", weight: 1 },
			{ id: "r3", name: "Meditate", status: "done", weight: -2 },
		];

		const punctualTasks1: PunctualTask[] = [
			{ id: "p1", name: "Buy groceries", status: "todo", weight: 1 },
			{ id: "p2", name: "Call mom", status: "done", weight: 3 },
		];

		context1.heroRepository.get = (): Hero => hero1;
		context1.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks1;
		context1.todoPunctualTaskRepository.getAll = (): PunctualTask[] => punctualTasks1;

		const exported = exportTasks(context1);

		const importedRecurringTasks: RecurringTask[] = [];
		const importedPunctualTasks: PunctualTask[] = [];
		let importedHero: Hero = { id: "hero-1", health: 100, level: 1, xp: 0 };

		context2.heroRepository.get = (): Hero => importedHero;
		context2.heroRepository.update = (hero: Hero): void => {
			importedHero = hero;
		};
		context2.todoRecurringTaskRepository.getAll = (): RecurringTask[] => importedRecurringTasks;
		context2.todoRecurringTaskRepository.create = (task: RecurringTask): void => {
			importedRecurringTasks.push(task);
		};
		context2.todoPunctualTaskRepository.getAll = (): PunctualTask[] => importedPunctualTasks;
		context2.todoPunctualTaskRepository.create = (task: PunctualTask): void => {
			importedPunctualTasks.push(task);
		};

		const mockBrowserService = createMockBrowserService();
		mockBrowserService.readFile = async (): Promise<string> => exported;

		await importHabiticaTasks(mockBrowserService, context2);

		expect(importedHero.health).toBe(85);
		expect(importedHero.level).toBe(5);
		expect(importedHero.xp).toBe(67);

		expect(importedRecurringTasks).toHaveLength(3);
		expect(importedRecurringTasks[0].name).toBe("Morning Run");
		expect(importedRecurringTasks[0].weight).toBe(2);
		expect(importedRecurringTasks[0].status).toBe("todo");

		expect(importedRecurringTasks[2].name).toBe("Meditate");
		expect(importedRecurringTasks[2].weight).toBe(-2);
		expect(importedRecurringTasks[2].status).toBe("done");

		expect(importedPunctualTasks).toHaveLength(2);
		expect(importedPunctualTasks[0].name).toBe("Buy groceries");
		expect(importedPunctualTasks[0].weight).toBe(1);
		expect(importedPunctualTasks[0].status).toBe("todo");

		expect(importedPunctualTasks[1].name).toBe("Call mom");
		expect(importedPunctualTasks[1].weight).toBe(3);
		expect(importedPunctualTasks[1].status).toBe("done");
	});
});
