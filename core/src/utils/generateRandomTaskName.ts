import { randomPick } from "./randomPick";
import { getSampleAdjectiveList } from "./getSampleAdjectiveList";
import { getSampleTaskNameList } from "./getSampleTaskNameList";

export function generateRandomTaskName(): string {
	const adjective = randomPick(getSampleAdjectiveList());
	const task = randomPick(getSampleTaskNameList());
	return `${adjective} ${task}`;
}
