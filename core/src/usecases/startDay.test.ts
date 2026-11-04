import { describe, it, expect } from "vitest";
import { startDay } from "./startDay";
import { calculateWeightAverage } from "./calculateWeightAverage";
import type { RecurringTask } from "../entities/RecurringTask";
import type { Hero } from "../entities/Hero";
import { createMockTodoContext } from "../mocks/createMockTodoContext";
import { withLowerThanMinusFiveWeightAverage } from "../fixtures/withLowerThanMinusFiveWeightAverage";
import { withHighWeightAverage } from "../fixtures/withHighWeightAverage";
import { withExistingMalus } from "../fixtures/withExistingMalus";
import { createTodoRecurringTaskRepositoryMock } from "../mocks/createTodoRecurringTaskRepositoryMock";

describe("startDay", () => {
	it("should decrease health for unfinished tasks and reset them", () => {
		const context = createMockTodoContext();
		let updatedHero: Hero | null = null;
		const updatedTasks: RecurringTask[] = [];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "todo", weight: 1 },
			{ id: "task-2", name: "Task 2", status: "postponed", weight: 1 },
			{ id: "task-3", name: "Task 3", status: "done", weight: 1 },
			{ id: "task-4", name: "Task 4", status: "unnecessary", weight: 1 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.heroRepository.update = (h: Hero): void => {
			updatedHero = h;
		};
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;
		context.todoRecurringTaskRepository.update = (task: RecurringTask): void => {
			updatedTasks.push(task);
		};

		startDay(context);

		// 2 unfinished tasks (todo + postponed) * (10 / 3 total, excluding unnecessary) = 2 * 3.33 = 6.67, floored = 6 damage
		expect((updatedHero as unknown as Hero).health).toBe(94);
		// All tasks should be reset to "todo"
		expect(updatedTasks).toHaveLength(4);
		expect(updatedTasks.every((task) => task.status === "todo")).toBe(true);
		// Unfinished tasks should have weight incremented, done task should have weight decremented
		const todoTask = updatedTasks.find((t) => t.id === "task-1");
		const postponedTask = updatedTasks.find((t) => t.id === "task-2");
		const doneTask = updatedTasks.find((t) => t.id === "task-3");
		expect(todoTask?.weight).toBe(2); // 1 + 1
		expect(postponedTask?.weight).toBe(2); // 1 + 1
		expect(doneTask?.weight).toBe(0); // 1 - 1 = 0 (can go negative)
	});

	it("should gain XP proportionally to completed tasks", () => {
		const context = createMockTodoContext();
		let updatedHero: Hero | null = null;

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		// 5 tasks: 2 done, 2 todo, 1 unnecessary = 5 total (but unnecessary excluded from total = 4)
		// XP gained = 2 * (10 / 4) = 5
		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "done", weight: 1 },
			{ id: "task-2", name: "Task 2", status: "done", weight: 1 },
			{ id: "task-3", name: "Task 3", status: "todo", weight: 1 },
			{ id: "task-4", name: "Task 4", status: "todo", weight: 1 },
			{ id: "task-5", name: "Task 5", status: "unnecessary", weight: 1 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.heroRepository.update = (h: Hero): void => {
			updatedHero = h;
		};
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;

		startDay(context);

		expect((updatedHero as unknown as Hero).xp).toBe(5);
	});

	it("should level up and restore health when XP >= 100", () => {
		const context = createMockTodoContext();
		let updatedHero: Hero | null = null;

		const hero: Hero = {
			id: "hero-1",
			health: 80,
			level: 1,
			xp: 95,
		};

		// 2 tasks: 1 done, 1 todo = 2 total
		// XP gained = 1 * (10 / 2) = 5
		// Total XP = 95 + 5 = 100 >= 100, so level up
		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "done", weight: 1 },
			{ id: "task-2", name: "Task 2", status: "todo", weight: 1 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.heroRepository.update = (h: Hero): void => {
			updatedHero = h;
		};
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;

		startDay(context);

		expect((updatedHero as unknown as Hero).health).toBe(100);
		expect((updatedHero as unknown as Hero).level).toBe(2);
		expect((updatedHero as unknown as Hero).xp).toBe(0); // 100 - 100
	});

	it("should increase weight for unfinished punctual tasks", () => {
		const context = createMockTodoContext();
		const updatedTasks: import("../entities").PunctualTask[] = [];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		const punctualTasks: import("../entities").PunctualTask[] = [
			{ id: "task-1", name: "Task 1", status: "todo", weight: 2 },
			{ id: "task-2", name: "Task 2", status: "done", weight: 3 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.todoPunctualTaskRepository.getAll = (): import("../entities").PunctualTask[] =>
			punctualTasks;
		context.todoPunctualTaskRepository.update = (
			task: import("../entities").PunctualTask,
		): void => {
			updatedTasks.push(task);
		};

		startDay(context);

		// Unfinished task should have weight incremented
		const unfinishedTask = updatedTasks.find((t) => t.id === "task-1");
		expect(unfinishedTask?.weight).toBe(3); // 2 + 1
		expect(unfinishedTask?.status).toBe("todo");

		// Done task should have weight decremented
		const doneTask = updatedTasks.find((t) => t.id === "task-2");
		expect(doneTask?.weight).toBe(2); // 3 - 1
		expect(doneTask?.status).toBe("todo");
	});

	it("should NOT level up when hero dies even with sufficient XP for level up", () => {
		const context = createMockTodoContext();
		let updatedHero: Hero | null = null;

		const hero: Hero = {
			id: "hero-1",
			health: 2,
			level: 1,
			xp: 97,
		};

		// 3 tasks: 1 done, 2 todo
		// Damage = 2 * (10 / 3) = 6.67, floored (no) = 6.67
		// Health = 2 - 6.67 = -4.67 (dead)
		// XP gained = 1 * (10 / 3) = 3.33, floored = 3
		// Total XP = 97 + 3 = 100 (exactly enough for level up!)
		// But hero is dead (newHealth < 0), so NO level up should happen
		// This tests the métier rule: "if hero dies, no level up even with XP >= 100"
		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "done", weight: 1 },
			{ id: "task-2", name: "Task 2", status: "todo", weight: 1 },
			{ id: "task-3", name: "Task 3", status: "todo", weight: 1 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.heroRepository.update = (h: Hero): void => {
			updatedHero = h;
		};
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => recurringTasks;

		startDay(context);

		// Métier: Un héros mort ne level up pas, même avec XP >= 100
		// Ce test tue le mutant `if (true && newXp >= 100)` car:
		// - newHealth < 0 (mort)
		// - newXp >= 100 (suffisant pour level up)
		// - mais le level up ne doit PAS se produire
		expect((updatedHero as unknown as Hero).health).toBe(0); // Clamped from negative
		expect((updatedHero as unknown as Hero).level).toBe(1); // No level up!
		expect((updatedHero as unknown as Hero).xp).toBe(100); // XP preserved even when dead
	});

	it("should increase weight for postponed punctual tasks", () => {
		const context = createMockTodoContext();
		const updatedTasks: import("../entities").PunctualTask[] = [];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		const punctualTasks: import("../entities").PunctualTask[] = [
			{ id: "task-1", name: "Task 1", status: "postponed", weight: 2 },
		];

		context.heroRepository.get = (): Hero => hero;
		context.todoPunctualTaskRepository.getAll = (): import("../entities").PunctualTask[] =>
			punctualTasks;
		context.todoPunctualTaskRepository.update = (
			task: import("../entities").PunctualTask,
		): void => {
			updatedTasks.push(task);
		};

		startDay(context);

		// Postponed task should have weight incremented (isUnfinished = true)
		const postponedTask = updatedTasks.find((t) => t.id === "task-1");
		expect(postponedTask?.weight).toBe(3); // 2 + 1
		expect(postponedTask?.status).toBe("todo");
	});

	it("should set task to unnecessary when weight becomes negative and random chance succeeds", () => {
		const context = createMockTodoContext();
		const updatedTasks: RecurringTask[] = [];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "done", weight: -10 },
		];

		const mockRecurringRepository = createTodoRecurringTaskRepositoryMock(recurringTasks);
		const originalUpdate = mockRecurringRepository.update;
		mockRecurringRepository.update = (task: RecurringTask): void => {
			updatedTasks.push(task);
			originalUpdate(task);
		};

		context.heroRepository.get = (): Hero => hero;
		context.todoRecurringTaskRepository = mockRecurringRepository;

		// Mock Math.random to return a value within the "unnecessary" probability range
		// For weight -10: average < -5, so apply +1 initial increment -> weight = -9
		// Then for status "done": weight = -9 - 1 = -10
		// Probability for -10: 10/11 ≈ 0.909, so 0.5 < 0.909 -> unnecessary
		const originalRandom = Math.random;
		Math.random = (): number => 0.5;

		try {
			startDay(context);
			const task = updatedTasks[updatedTasks.length - 1];
			expect(task?.status).toBe("unnecessary");
			expect(task?.weight).toBe(-10); // -10 + 1 (initial) - 1 (done)
		} finally {
			Math.random = originalRandom;
		}
	});

	it("should keep task as todo when weight becomes negative but random chance fails", () => {
		const context = createMockTodoContext();
		const updatedTasks: RecurringTask[] = [];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		const recurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Task 1", status: "done", weight: 0 },
		];

		const mockRecurringRepository = createTodoRecurringTaskRepositoryMock(recurringTasks);
		const originalUpdate = mockRecurringRepository.update;
		mockRecurringRepository.update = (task: RecurringTask): void => {
			updatedTasks.push(task);
			originalUpdate(task);
		};

		context.heroRepository.get = (): Hero => hero;
		context.todoRecurringTaskRepository = mockRecurringRepository;

		// Mock Math.random to return a value outside the "unnecessary" probability range
		// For weight 0 -> newWeight -1: probability = 1/2 = 0.5, so 0.6 > 0.5 -> todo
		const originalRandom = Math.random;
		Math.random = (): number => 0.6;

		try {
			startDay(context);
			const task = updatedTasks[updatedTasks.length - 1];
			expect(task?.status).toBe("todo");
			expect(task?.weight).toBe(-1); // 0 - 1
		} finally {
			Math.random = originalRandom;
		}
	});

	it("should increment weight of all tasks by 1 first if average weight is less than -5", () => {
		const context = withLowerThanMinusFiveWeightAverage();

		// Calculate initial average weight
		const initialRecurringTasks = context.todoRecurringTaskRepository.getAll();
		const initialPunctualTasks = context.todoPunctualTaskRepository.getAll();
		const initialAverage = calculateWeightAverage(initialPunctualTasks, initialRecurringTasks);

		startDay(context);

		// Calculate final average weight
		const finalRecurringTasks = context.todoRecurringTaskRepository.getAll();
		const finalPunctualTasks = context.todoPunctualTaskRepository.getAll();
		const finalAverage = calculateWeightAverage(finalPunctualTasks, finalRecurringTasks);

		// Average weight should be incremented by 2 (initial increment +1, then status rule +1 for all "todo" tasks)
		expect(finalAverage).toBe(initialAverage + 2);
	});

	it("should create MALUS task when average weight is high", () => {
		const context = withHighWeightAverage();

		startDay(context);

		const finalPunctualTasks = context.todoPunctualTaskRepository.getAll();
		const malusTask = finalPunctualTasks.find((task) => task.name === "MALUS");

		// MALUS should be created
		expect(malusTask).toBeDefined();
		expect(malusTask?.status).toBe("postponed");
		// Average of top 3 tasks after weight increment: (26 + 25 + 25) / 3 = 25.33
		// Heavy tasks count (weight > 21): 3
		// malusWeight = round((25.33 * 3) / 4) = round(76 / 4) = 19
		expect(malusTask?.weight).toBe(19);
	});

	it("should delete MALUS task when average weight is not high", () => {
		const context = withExistingMalus();

		startDay(context);

		const finalPunctualTasks = context.todoPunctualTaskRepository.getAll();
		const malusTask = finalPunctualTasks.find((task) => task.name === "MALUS");

		// MALUS should be deleted because average weight is low
		expect(malusTask).toBeUndefined();
	});

	it("should exclude MALUS task itself from heavy task count and top 3 calculation", () => {
		const context = createMockTodoContext();
		const updatedPunctualTasks: import("../entities").PunctualTask[] = [
			{ id: "malus", name: "MALUS", status: "postponed", weight: 50 }, // Existing MALUS from previous day
		];

		const hero: Hero = {
			id: "hero-1",
			health: 100,
			level: 1,
			xp: 0,
		};

		// Setup: 2 real tasks with weight 25 (todo status)
		// + 1 existing MALUS task with weight 50 (postponed status, not yet updated)
		// After weight increment in startDay:
		// - The 2 real tasks: 25 -> 26 (todo, unfinished)
		// - The MALUS task: 50 -> 51 (postponed, unfinished, then status forced back to "postponed")
		// When computing new MALUS:
		// - allTasksExcludingMalus = 2 real tasks with weight 26
		// - topThreeAverage = 26 (average of [26, 26])
		// - heavyTasksCount = 2 (both 26 > 21)
		// - malusWeight = round(26 * 2) = 52 (NOT influenced by the old MALUS weight 51)
		const realRecurringTasks: RecurringTask[] = [
			{ id: "task-1", name: "Real Task 1", status: "todo", weight: 25 },
			{ id: "task-2", name: "Real Task 2", status: "todo", weight: 25 },
		];

		const allRecurringTasks = realRecurringTasks;

		context.heroRepository.get = (): Hero => hero;
		context.todoRecurringTaskRepository.getAll = (): RecurringTask[] => allRecurringTasks;
		context.todoRecurringTaskRepository.update = (task: RecurringTask): void => {
			const index = allRecurringTasks.findIndex((t) => t.id === task.id);
			if (index !== -1) allRecurringTasks[index] = task;
		};
		context.todoPunctualTaskRepository.getAll = (): import("../entities").PunctualTask[] =>
			updatedPunctualTasks;
		context.todoPunctualTaskRepository.update = (
			task: import("../entities").PunctualTask,
		): void => {
			const index = updatedPunctualTasks.findIndex((t) => t.id === task.id);
			if (index !== -1) updatedPunctualTasks[index] = task;
		};

		startDay(context);

		const malusTask = updatedPunctualTasks.find((task) => task.name === "MALUS");
		// The MALUS weight should NOT include the old MALUS in its calculation
		// It should only reflect the 2 real tasks: round((26 * 2) / 4) = round(52 / 4) = 13
		expect(malusTask?.weight).toBe(13);
	});

});
