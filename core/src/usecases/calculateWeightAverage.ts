import type { PunctualTask, RecurringTask } from "../entities";

export function calculateWeightAverage(
	punctuals: PunctualTask[],
	recurring: RecurringTask[],
): number {
	const all = [...punctuals, ...recurring];
	return all.length > 0 ? all.reduce((sum, t) => sum + t.weight, 0) / all.length : 0;
}
