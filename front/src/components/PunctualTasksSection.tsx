import type { ReactNode } from "react";
import type { PunctualTask } from "@todo/core";
import { PunctualTaskCard } from "./PunctualTaskCard";

interface PunctualTasksSectionProps {
	tasks: PunctualTask[];
}

export function PunctualTasksSection({ tasks }: PunctualTasksSectionProps): ReactNode {
	const sortedTasks = [...tasks].sort((a, b) => b.weight - a.weight);

	return (
		<section>
			<h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
				Punctual Tasks ({tasks.length})
			</h2>
			{tasks.length === 0 ? (
				<p style={{ color: "#6b7280", fontSize: "14px" }}>
					No punctual tasks yet
				</p>
			) : (
				sortedTasks.map((task) => (
					<PunctualTaskCard key={task.id} id={task.id} name={task.name} weight={task.weight} />
				))
			)}
		</section>
	);
}
