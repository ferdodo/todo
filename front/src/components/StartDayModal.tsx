import { useState, useEffect, type ReactNode } from "react";
import { TodoStartDayModal } from "@todo/ui";
import { startDay } from "@todo/core";
import { useTodoContext } from "../hooks/useTodoContext";
import type { PunctualTask } from "@todo/core";

interface StartDayModalProps {
	punctualTasks?: PunctualTask[];
}

export function StartDayModal({ punctualTasks = [] }: StartDayModalProps): ReactNode {
	const context = useTodoContext();
	const [isOpen, setIsOpen] = useState(false);
	const [unfinishedCount, setUnfinishedCount] = useState(0);
	const [completedCount, setCompletedCount] = useState(0);

	useEffect(() => {
		const unsubscribe = context.todoRecurringTaskRepository.observe((tasks) => {
			const unfinished = tasks.filter(
				(t) => t.status === "todo",
			).length;
			const completed = tasks.filter((t) => t.status === "done").length;
			setUnfinishedCount(unfinished);
			setCompletedCount(completed);
		});
		const tasks = context.todoRecurringTaskRepository.getAll();
		const unfinished = tasks.filter((t) => t.status === "todo")
			.length;
		const completed = tasks.filter((t) => t.status === "done").length;
		setUnfinishedCount(unfinished);
		setCompletedCount(completed);
		return unsubscribe;
	}, [context.todoRecurringTaskRepository]);

	const handleStartDay = (): void => {
		startDay(context);
		setIsOpen(false);
	};

	const handleCancel = (): void => {
		setIsOpen(false);
	};

	const healthLoss = unfinishedCount * 10;
	const unfinishedPunctualCount = punctualTasks.filter(
		(t) => t.status === "todo",
	).length;
	const hasAnyUnfinishedTasks = unfinishedCount > 0 || unfinishedPunctualCount > 0;

	return (
		<>
			{!hasAnyUnfinishedTasks && (
				<button
					type="button"
					onClick={() => {
						setIsOpen(true);
					}}
					style={{
												backgroundColor: "var(--color-green)",
																																									}}
				>
					Start Day
				</button>
			)}
			<TodoStartDayModal
				isOpen={isOpen}
				unfinishedTasksCount={unfinishedCount}
				completedTasksCount={completedCount}
				healthLoss={healthLoss}
				onStartDay={handleStartDay}
				onCancel={handleCancel}
			/>
		</>
	);
}
