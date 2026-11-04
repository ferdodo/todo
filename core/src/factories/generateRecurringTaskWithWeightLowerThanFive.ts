import type { RecurringTask } from "../entities";
import { generateRandomId } from "../utils/generateRandomId";
import { generateRandomTaskName } from "../utils/generateRandomTaskName";

function generateRandomNegativeWeight(): number {
	return Math.floor(Math.random() * 15) - 20;
}

export function generateRecurringTaskWithWeightLowerThanFive(): RecurringTask {
	return {
		id: generateRandomId(),
		name: generateRandomTaskName(),
		status: "todo",
		weight: generateRandomNegativeWeight(),
	};
}
