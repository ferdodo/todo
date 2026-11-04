import { useState, type ReactNode } from "react";
import { TodoUndoRedoButtons } from "@todo/ui";
import { AllTasksSection } from "./AllTasksSection";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { StartDayModal } from "./StartDayModal";
import type { PunctualTask, RecurringTask } from "@todo/core";

interface TasksAccordionProps {
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

export function TasksAccordion({
	recurringTasks,
	punctualTasks,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
}: TasksAccordionProps): ReactNode {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isExportOpen, setIsExportOpen] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);
	const todoCount = recurringTasks.filter((t) => t.status === "todo").length +
		punctualTasks.filter((t) => t.status === "todo").length;

	return (
		<div style={{ overflow: "hidden" }}>
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "16px 20px",
					border: "none",
					backgroundColor: "transparent",
					cursor: "pointer",
					fontSize: "20px",
					fontWeight: "600",
					color: "inherit",
				}}
			>
				<span>All Tasks ({todoCount})</span>
				<span
					style={{
						transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: `transform var(--transform-duration) var(--transform-function)`,
						display: "flex",
						alignItems: "center",
					}}
				>
					▼
				</span>
			</button>

			{isExpanded && (
				<div style={{ padding: "0 20px 20px" }}>
					<AllTasksSection
						recurringTasks={recurringTasks}
						punctualTasks={punctualTasks}
						showTitle={false}
					/>

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
								<button type="button" onClick={() => setIsExportOpen(true)} style={{ backgroundColor: "var(--color-blue)" }}>Export</button>
								<button type="button" onClick={() => setIsImportOpen(true)} style={{ backgroundColor: "var(--color-green)" }}>Import</button>
								<ExportModal isOpen={isExportOpen} onOpenChange={setIsExportOpen} />
								<ImportModal isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
