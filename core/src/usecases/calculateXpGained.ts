import type { RecurringTask } from "../entities/RecurringTask";
import type { PunctualTask } from "../entities/PunctualTask";

export function calculateXpGained(
	recurringTasks: RecurringTask[],
	punctualTasks: PunctualTask[],
): number {
	const completedWeightSum =
		recurringTasks
			.filter((task) => task.status === "done")
			.reduce((sum, task) => sum + Math.max(1, task.weight), 0) +
		punctualTasks
			.filter((task) => task.status === "done")
			.reduce((sum, task) => sum + Math.max(1, task.weight), 0);

	const totalWeightSum =
		recurringTasks
			.filter((task) => task.status !== "unnecessary")
			.reduce((sum, task) => sum + Math.max(1, task.weight), 0) +
		punctualTasks.reduce((sum, task) => sum + Math.max(1, task.weight), 0);

	return totalWeightSum > 0 ? completedWeightSum * (10 / totalWeightSum) : 0;
}
