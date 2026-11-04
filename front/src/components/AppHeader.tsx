import type { ReactNode } from "react";
import { TasksMenu } from "./TasksMenu";
import type { PunctualTask, RecurringTask } from "@todo/core";

interface AppHeaderProps {
	recurringTasks: RecurringTask[];
	punctualTasks: PunctualTask[];
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
	onAddTask: () => void;
}

export function AppHeader({
	recurringTasks,
	punctualTasks,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
}: AppHeaderProps): ReactNode {
	return (
		<div className="card">
			<TasksMenu
				recurringTasks={recurringTasks}
				punctualTasks={punctualTasks}
				onUndo={onUndo}
				onRedo={onRedo}
				canUndo={canUndo}
				canRedo={canRedo}
				undoLabel={undoLabel}
				redoLabel={redoLabel}
				onAddTask={onAddTask}
			/>
		</div>
	);
}
