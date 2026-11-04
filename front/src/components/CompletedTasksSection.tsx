import type { ReactNode } from "react";
import type { RecurringTask, PunctualTask } from "@todo/core";
import { RecurringTaskCard } from "./RecurringTaskCard";
import { PunctualTaskCard } from "./PunctualTaskCard";

interface CompletedTasksSectionProps {
	recurringTasks: RecurringTask[];
	punctualTasks: PunctualTask[];
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

export function CompletedTasksSection({
	recurringTasks,
	punctualTasks,
}: CompletedTasksSectionProps): ReactNode {
	const recurringWithType: RecurringTaskWithType[] = recurringTasks
		.filter((task) => task.status === "done")
		.map((task) => ({
			...task,
			taskType: "recurring",
		}));

	const punctualWithType: PunctualTaskWithType[] = punctualTasks
		.filter((task) => task.status === "done")
		.map((task) => ({
			...task,
			taskType: "punctual",
		}));

	const allTasks = [...recurringWithType, ...punctualWithType];

	if (allTasks.length === 0) {
		return null;
	}

	return (
		<section style={{ marginTop: "48px" }}>
			<h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#6b7280" }}>
				Completed Tasks ({allTasks.length})
			</h2>
			<div style={{ opacity: 0.6 }}>
				{allTasks.map(renderTaskCard)}
			</div>
		</section>
	);
}
