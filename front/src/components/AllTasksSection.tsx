import type { ReactNode } from "react";
import type { RecurringTask, PunctualTask } from "@todo/core";
import { RecurringTaskCard } from "./RecurringTaskCard";
import { PunctualTaskCard } from "./PunctualTaskCard";

interface AllTasksSectionProps {
	recurringTasks: RecurringTask[];
	punctualTasks: PunctualTask[];
	showTitle?: boolean;
}

type RecurringTaskWithType = RecurringTask & { taskType: "recurring" };
type PunctualTaskWithType = PunctualTask & { taskType: "punctual" };
type TaskWithType = RecurringTaskWithType | PunctualTaskWithType;

function isRecurring(task: TaskWithType): task is RecurringTaskWithType {
	return task.taskType === "recurring";
}

function renderTaskCard(item: TaskWithType): ReactNode {
	if (isRecurring(item)) {
		return (
			<RecurringTaskCard
				key={item.id}
				id={item.id}
				name={item.name}
				weight={item.weight}
			/>
		);
	}
	return (
		<PunctualTaskCard
			key={item.id}
			id={item.id}
			name={item.name}
			weight={item.weight}
		/>
	);
}

export function AllTasksSection({
	recurringTasks,
	punctualTasks
}: AllTasksSectionProps): ReactNode {
	const recurringWithType: RecurringTaskWithType[] = recurringTasks
		.filter((task) => task.status === "todo")
		.map((task) => ({
			...task,
			taskType: "recurring",
		}));

	const punctualWithType: PunctualTaskWithType[] = punctualTasks
		.filter((task) => task.status === "todo")
		.map((task) => ({
			...task,
			taskType: "punctual",
		}));

	const allTasks = [...recurringWithType, ...punctualWithType];
	const sortedTasks = allTasks.sort((a, b) => b.weight - a.weight);

	if (!sortedTasks.length) {
		return null;
	}

	return (
		<div style={{display: "flex", flexDirection: "column"}}>
			{sortedTasks.map(renderTaskCard)}
		</div>
	);
}
