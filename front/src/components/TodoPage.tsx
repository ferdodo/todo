import { useState, useEffect, type ReactNode } from "react";
import { TaskForm } from "./TaskForm";
import { ResurrectionModal } from "./ResurrectionModal";
import { AllTasksSection } from "./AllTasksSection";
import { NextDayCard } from "./NextDayCard";
import { ActionBar } from "./ActionBar";
import { useTodoContext } from "../hooks/useTodoContext";
import { useUndo } from "../hooks/useUndo";
import { useRedo } from "../hooks/useRedo";
import { useLastAction } from "../hooks/useLastAction";
import { useNextAction } from "../hooks/useNextAction";
import type { RecurringTask } from "@todo/core";
import type { PunctualTask } from "@todo/core";
import { XpBar } from "./XpBar";
import { HealthBar } from "./HealthBar";

export function TodoPage(): ReactNode {
	const context = useTodoContext();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
	const [punctualTasks, setPunctualTasks] = useState<PunctualTask[]>([]);
	const lastAction = useLastAction();
	const nextAction = useNextAction();
	const undo = useUndo();
	const redo = useRedo();

	useEffect(() => {
		const unsubscribeRecurring = context.todoRecurringTaskRepository.observe(
			(tasks) => {
				setRecurringTasks(tasks);
			},
		);
		const unsubscribePunctual = context.todoPunctualTaskRepository.observe((tasks) => {
			setPunctualTasks(tasks);
		});

		setRecurringTasks(context.todoRecurringTaskRepository.getAll());
		setPunctualTasks(context.todoPunctualTaskRepository.getAll());

		return () => {
			unsubscribeRecurring();
			unsubscribePunctual();
		};
	}, [context.todoRecurringTaskRepository, context.todoPunctualTaskRepository]);

	return (
		<div
			style={{
				padding: "var(--spacing)",
				maxWidth: "1200px",
				margin: "0 auto",
				fontFamily: "system-ui, -apple-system, sans-serif",
				overflowX: "hidden",
				display: "flex",
  				flexDirection: "column"
			}}
		>
			<XpBar />
			<HealthBar />

			<AllTasksSection recurringTasks={recurringTasks} punctualTasks={punctualTasks} />

			<NextDayCard recurringTasks={recurringTasks} punctualTasks={punctualTasks} />

			<ActionBar
				onUndo={undo}
				onRedo={redo}
				onAddTask={() => setIsFormOpen(true)}
				canUndo={!!lastAction}
				canRedo={!!nextAction}
				undoLabel={lastAction ? lastAction.description : undefined}
				redoLabel={nextAction ? nextAction.description : undefined}
			/>

			<TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
			<ResurrectionModal />
		</div>
	);
}
