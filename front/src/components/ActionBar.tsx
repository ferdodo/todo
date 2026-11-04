import { useState, type ReactNode } from "react";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { ConfirmationModal } from "./ConfirmationModal";

interface ActionBarProps {
	onUndo: () => void;
	onRedo: () => void;
	onAddTask: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
}

export function ActionBar({
	onUndo,
	onRedo,
	onAddTask,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
}: ActionBarProps): ReactNode {
	const [confirmAction, setConfirmAction] = useState<"undo" | "redo" | null>(null);
	const [isExportOpen, setIsExportOpen] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);

	const handleUndoClick = (): void => {
		if (canUndo) setConfirmAction("undo");
	};

	const handleRedoClick = (): void => {
		if (canRedo) setConfirmAction("redo");
	};

	const handleConfirm = (): void => {
		const actions: Record<string, () => void> = {
			undo: onUndo,
			redo: onRedo,
		};
		actions[confirmAction ?? ""]?.();
		setConfirmAction(null);
	};

	const handleCancel = (): void => {
		setConfirmAction(null);
	};

	return (
		<>
			<div style={{ backgroundColor: "white", borderRadius: "var(--border-radius)", padding: "var(--spacing-s)", display: "flex", justifyContent: "space-around", boxShadow: "var(--box-shadow)" }}>
				<button type="button" onClick={handleUndoClick} disabled={!canUndo} title={undoLabel} style={{ backgroundColor: "transparent", border: "none", color: "black", cursor: "pointer" }}>
					↶
				</button>
				<button type="button" onClick={handleRedoClick} disabled={!canRedo} title={redoLabel} style={{ backgroundColor: "transparent", border: "none", color: "black", cursor: "pointer" }}>
					↷
				</button>
				<button type="button" onClick={() => setIsImportOpen(true)} style={{ backgroundColor: "transparent", border: "none", color: "black", cursor: "pointer" }}>↓</button>
				<button type="button" onClick={() => setIsExportOpen(true)} style={{ backgroundColor: "transparent", border: "none", color: "black", cursor: "pointer" }}>↑</button>
				<button type="button" onClick={onAddTask} style={{ backgroundColor: "transparent", border: "none", color: "black", cursor: "pointer" }}>+</button>
			</div>
			<ImportModal isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
			<ExportModal isOpen={isExportOpen} onOpenChange={setIsExportOpen} />
			<ConfirmationModal
				isOpen={confirmAction === "undo"}
				title={`Undo: ${undoLabel || "action"}?`}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
			<ConfirmationModal
				isOpen={confirmAction === "redo"}
				title={`Redo: ${redoLabel || "action"}?`}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</>
	);
}
