import type { ReactNode } from "react";
import type { RecurringTask } from "@todo/core";
import { RecurringTaskCard } from "./RecurringTaskCard";

interface RecurringTasksSectionProps {
	tasks: RecurringTask[];
}

export function RecurringTasksSection({ tasks }: RecurringTasksSectionProps): ReactNode {
	const todoTasks = tasks
		.filter((t) => t.status === "todo")
		.sort((a, b) => b.weight - a.weight);

	return (
		<section>
			<h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
				Recurring Tasks to Do
			</h2>
			{todoTasks.length === 0 ? (
				<p style={{ color: "#6b7280", fontSize: "14px" }}>
					All done! Great job!
				</p>
			) : (
				todoTasks.map((task) => (
					<RecurringTaskCard
						key={task.id}
						id={task.id}
						name={task.name}
						weight={task.weight}
					/>
				))
			)}
		</section>
	);
}
