import type { PunctualTask } from "./PunctualTask";
import type { RecurringTask } from "./RecurringTask";

type ActionType = "add_task" | "do_task" | "postpone_task" | "delete_task" | "split_task" | "rename_task";
type TaskType = "punctual" | "recurring";

export type Action = {
	id: string;
	type: ActionType;
	taskType: TaskType;
	timestamp: number;
	description: string;
	previousState?: PunctualTask | RecurringTask;
	newState: PunctualTask | RecurringTask;
};
