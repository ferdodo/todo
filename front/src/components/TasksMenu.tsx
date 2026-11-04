import { useRef, useState, type ReactNode } from "react";
import { TodoUndoRedoButtons } from "@todo/ui";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { StartDayModal } from "./StartDayModal";
import type { PunctualTask, RecurringTask } from "@todo/core";

interface TasksMenuProps {
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

function MenuButton({ label, onClick }: { label: string; onClick: () => void }): ReactNode {
	const chevron = label === "More" ? "▼" : "▲";

	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "16px 20px",
				border: "none",
				backgroundColor: "transparent",
				cursor: "pointer",
				fontSize: "16px",
				fontWeight: "600",
				color: "inherit",
			}}
		>
			<span>{label}</span>
			<span style={{ display: "flex", alignItems: "center" }}>{chevron}</span>
		</button>
	);
}

function MenuContent({
	todoCount,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
	punctualTasks,
}: {
	todoCount: number;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
	onAddTask: () => void;
	punctualTasks: PunctualTask[];
}): ReactNode {
	const [isExportOpen, setIsExportOpen] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);
	return (
		<div style={{ padding: "0 20px 20px" }}>
			<h2 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 16px 0" }}>
				All Tasks ({todoCount})
			</h2>

			<div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
				<div style={{ marginBottom: "16px" }}>
					<TodoUndoRedoButtons
						onUndo={onUndo}
						onRedo={onRedo}
						canUndo={canUndo}
						canRedo={canRedo}
						undoLabel={undoLabel}
						redoLabel={redoLabel}
					/>
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					<div style={{ display: "flex", gap: "8px" }}>
						<button
							type="button"
							onClick={onAddTask}
							style={{
								backgroundColor: "var(--color-blue)",
							}}
						>
							Add Task
						</button>
						<StartDayModal punctualTasks={punctualTasks} />
					</div>

					<div style={{ display: "flex", gap: "8px" }}>
						<button
							type="button"
							onClick={() => setIsExportOpen(true)}
							style={{
								backgroundColor: "var(--color-blue)",
							}}
						>
							Export
						</button>
						<button
							type="button"
							onClick={() => setIsImportOpen(true)}
							style={{
								backgroundColor: "var(--color-green)",
							}}
						>
							Import
						</button>
					</div>
					<ExportModal isOpen={isExportOpen} onOpenChange={setIsExportOpen} />
					<ImportModal isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
				</div>
			</div>
		</div>
	);
}

export function TasksMenu({
	recurringTasks,
	punctualTasks,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
}: TasksMenuProps): ReactNode {
	const [isExpanded, setIsExpanded] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const todoCount = recurringTasks.filter((t) => t.status === "todo").length +
		punctualTasks.filter((t) => t.status === "todo").length;

	return (
		<>
			<div
				ref={contentRef}
				style={{
					overflow: "hidden",
					maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0,
					transition: `max-height var(--transform-duration) var(--transform-function)`,
				}}
			>
				<MenuContent
					todoCount={todoCount}
					onUndo={onUndo}
					onRedo={onRedo}
					canUndo={canUndo}
					canRedo={canRedo}
					undoLabel={undoLabel}
					redoLabel={redoLabel}
					onAddTask={onAddTask}
					punctualTasks={punctualTasks}
				/>
			</div>

			<MenuButton label={isExpanded ? "Less" : "More"} onClick={() => setIsExpanded(!isExpanded)} />
		</>
	);
}
