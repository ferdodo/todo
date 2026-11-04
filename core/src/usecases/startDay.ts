import type { TodoContext } from "../contexts/TodoContext";
import { calculateHealthLoss } from "./calculateHealthLoss";
import { calculateXpGained } from "./calculateXpGained";
import { calculateWeightAverage } from "./calculateWeightAverage";
import { MALUS_THRESHOLD } from "../constants/MALUS_THRESHOLD";

export function startDay(context: TodoContext): void {
	const hero = context.heroRepository.get();
	let recurringTasks = context.todoRecurringTaskRepository.getAll();
	let punctualTasks = context.todoPunctualTaskRepository.getAll();

	// Check if average weight < -5 for initial increment
	const averageWeight = calculateWeightAverage(punctualTasks, recurringTasks);

	// If average < -5, apply initial increment to all tasks
	if (averageWeight < -5) {
		recurringTasks.forEach((task) => {
			context.todoRecurringTaskRepository.update({
				...task,
				weight: task.weight + 1,
			});
		});

		punctualTasks.forEach((task) => {
			context.todoPunctualTaskRepository.update({
				...task,
				weight: task.weight + 1,
			});
		});

		// Refresh tasks after initial increment
		recurringTasks = context.todoRecurringTaskRepository.getAll();
		punctualTasks = context.todoPunctualTaskRepository.getAll();
	}

	// Calculate damage and XP using weight system
	const totalDamage = Math.floor(calculateHealthLoss(recurringTasks, punctualTasks));
	const newHealth = Math.max(0, hero.health - totalDamage);

	const xpGained = calculateXpGained(recurringTasks, punctualTasks);
	const newXp = hero.xp + xpGained;

	// Check for level up (only if hero survives, not dead)
	let finalHealth = newHealth;
	let finalLevel = hero.level;
	let finalXp = newXp;

	if (newHealth > 0 && newXp >= 100) {
		// Level up: restore full health, increase level, reset XP
		finalHealth = 100;
		finalLevel = hero.level + 1;
		finalXp = newXp - 100;
	}

	// Update hero
	context.heroRepository.update({
		...hero,
		health: finalHealth,
		level: finalLevel,
		xp: Math.floor(finalXp), // Round to avoid float precision issues
	});

	// Update recurring tasks: increment weight for unfinished, decrement for completed
	recurringTasks.forEach((task) => {
		const isUnfinished = task.status === "todo" || task.status === "postponed";
		const newWeight = isUnfinished ? task.weight + 1 : task.weight - 1;

		let newStatus: "todo" | "unnecessary" = "todo";
		if (newWeight < 0) {
			const probability = Math.abs(newWeight) / (Math.abs(newWeight) + 1);
			if (Math.random() < probability) {
				newStatus = "unnecessary";
			}
		}

		context.todoRecurringTaskRepository.update({
			...task,
			status: newStatus,
			weight: newWeight,
		});
	});

	// Update punctual tasks: increment weight for unfinished, decrement for completed
	// Punctual tasks always return to "todo", they never become "unnecessary"
	punctualTasks.forEach((task) => {
		const isUnfinished = task.status === "todo" || task.status === "postponed";
		const newWeight = isUnfinished ? task.weight + 1 : task.weight - 1;

		context.todoPunctualTaskRepository.update({
			...task,
			status: "todo",
			weight: newWeight,
		});
	});

	// Handle MALUS task based on average weight of tasks that will be "todo" tomorrow
	const updatedRecurringTasks = context.todoRecurringTaskRepository.getAll();
	const updatedPunctualTasks = context.todoPunctualTaskRepository.getAll();

	// Calculate average of all tasks that will be "todo" tomorrow (excluding "unnecessary" recurring tasks)
	const todoTomorrowTasks = [
		...updatedPunctualTasks,
		...updatedRecurringTasks.filter((task) => task.status !== "unnecessary"),
	];
	const finalAverageWeight =
		todoTomorrowTasks.length > 0
			? todoTomorrowTasks.reduce((sum, task) => sum + task.weight, 0) / todoTomorrowTasks.length
			: 0;

	if (finalAverageWeight > MALUS_THRESHOLD) {
		const allTasksExcludingMalus = [...updatedPunctualTasks, ...updatedRecurringTasks].filter(
			(task) => task.name !== "MALUS",
		);
		const topThreeTasks = allTasksExcludingMalus.sort((a, b) => b.weight - a.weight).slice(0, 3);

		if (topThreeTasks.length > 0) {
			const topThreeAverage =
				topThreeTasks.reduce((sum, task) => sum + task.weight, 0) / topThreeTasks.length;
			const heavyTasksCount = allTasksExcludingMalus.filter(
				(task) => task.weight > MALUS_THRESHOLD,
			).length;
			const malusWeight = Math.round((topThreeAverage * heavyTasksCount) / 4);

			const existingMalus = updatedPunctualTasks.find((task) => task.name === "MALUS");
			if (existingMalus) {
				context.todoPunctualTaskRepository.update({
					...existingMalus,
					weight: malusWeight,
					status: "postponed",
				});
			} else {
				context.todoPunctualTaskRepository.create({
					id: "malus",
					name: "MALUS",
					weight: malusWeight,
					status: "postponed",
				});
			}
		}
	} else {
		const existingMalus = updatedPunctualTasks.find((task) => task.name === "MALUS");
		if (existingMalus) {
			context.todoPunctualTaskRepository.delete(existingMalus.id);
		}
	}
}
