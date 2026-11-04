import type { PunctualTask } from "../entities";
import { generateRandomId } from "../utils/generateRandomId";
import { generateRandomTaskName } from "../utils/generateRandomTaskName";

function generateRandomNegativeWeight(): number {
	return Math.floor(Math.random() * 15) - 20;
}

export function generatePunctualTaskWithWeightLowerThanFive(): PunctualTask {
	return {
		id: generateRandomId(),
		name: generateRandomTaskName(),
		status: "todo",
		weight: generateRandomNegativeWeight(),
	};
}
