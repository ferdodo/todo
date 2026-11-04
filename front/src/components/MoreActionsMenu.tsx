import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TodoUndoRedoButtons } from "@todo/ui";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { StartDayModal } from "./StartDayModal";
import type { PunctualTask } from "@todo/core";

interface MoreActionsMenuProps {
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
	onAddTask?: () => void;
	punctualTasks?: PunctualTask[];
}

const getMenuPosition = (buttonElement: HTMLButtonElement | null): { top: number; right: number } | null => {
	if (!buttonElement) return null;
	const rect = buttonElement.getBoundingClientRect();
	return {
		top: rect.bottom + 8,
		right: window.innerWidth - rect.right,
	};
};

interface MenuContentProps {
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
	onAddTask?: () => void;
	punctualTasks: PunctualTask[];
	onClose: () => void;
}

function MenuContent({
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
	punctualTasks,
	onClose,
}: MenuContentProps): ReactNode {
	const [isExportOpen, setIsExportOpen] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);
	return (
		<>
			<div style={{ padding: "8px" }}>
				<TodoUndoRedoButtons
					onUndo={onUndo}
					onRedo={onRedo}
					canUndo={canUndo}
					canRedo={canRedo}
					undoLabel={undoLabel}
					redoLabel={redoLabel}
				/>
			</div>

			<div
				style={{
					borderTop: "1px solid #e5e7eb",
					padding: "8px",
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}
			>
				<div style={{ display: "flex", gap: "4px" }}>
					{onAddTask && (
						<button
							type="button"
							onClick={() => {
								onAddTask();
								onClose();
							}}
							style={{
								backgroundColor: "var(--color-blue)",
							}}
						>
							Add Task
						</button>
					)}
					<StartDayModal punctualTasks={punctualTasks} />
				</div>

				<div style={{ display: "flex", gap: "4px" }}>
					<button type="button" onClick={() => setIsExportOpen(true)} style={{ backgroundColor: "var(--color-blue)" }}>Export</button>
					<button type="button" onClick={() => setIsImportOpen(true)} style={{ backgroundColor: "var(--color-green)" }}>Import</button>
					<ExportModal isOpen={isExportOpen} onOpenChange={setIsExportOpen} />
					<ImportModal isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
				</div>
			</div>
		</>
	);
}

export function MoreActionsMenu({
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	onAddTask,
	punctualTasks = [],
}: MoreActionsMenuProps): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
	const portalRoot = typeof document !== "undefined" ? document.getElementById("portal-root") : null;

	useLayoutEffect(() => {
		if (isOpen) {
			setMenuPos(getMenuPosition(buttonRef.current));
		}
	}, [isOpen]);

	return (
		<>
			<button
				ref={buttonRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				style={{
					backgroundColor: "var(--color-blue-weak)",
				}}
				title="More actions"
			>
				⋮
			</button>

			{isOpen && menuPos && portalRoot && createPortal(
				<>
					<button
						type="button"
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 4999,
							background: "none",
							border: "none",
							padding: 0,
							cursor: "default",
						}}
						onClick={() => setIsOpen(false)}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Escape") setIsOpen(false);
						}}
						aria-label="Close menu"
					/>
					<div
						style={{
							position: "fixed",
							top: `${menuPos.top}px`,
							right: `${menuPos.right}px`,
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							borderRadius: "6px",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							zIndex: 5000,
							minWidth: "200px",
							padding: "8px",
							pointerEvents: "auto",
						}}
					>
						<MenuContent
							onUndo={onUndo}
							onRedo={onRedo}
							canUndo={canUndo}
							canRedo={canRedo}
							undoLabel={undoLabel}
							redoLabel={redoLabel}
							onAddTask={onAddTask}
							punctualTasks={punctualTasks}
							onClose={() => setIsOpen(false)}
						/>
					</div>
				</>,
				portalRoot
			)}
		</>
	);
}
