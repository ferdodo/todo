import type { ReactNode } from "react";

interface TodoUndoRedoButtonsProps {
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
}

export function TodoUndoRedoButtons({
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
}: TodoUndoRedoButtonsProps): ReactNode {
	return (
		<div style={{ display: "flex", gap: "8px" }}>
			<button
				type="button"
				onClick={onUndo}
				disabled={!canUndo}
				title={undoLabel || "Nothing to undo"}
				style={{
					backgroundColor: canUndo ? "var(--color-blue)" : "var(--color-blue-weak)",
				}}
			>
				↶ {undoLabel ? undoLabel.split(": ")[1] : "Undo"}
			</button>
			<button
				type="button"
				onClick={onRedo}
				disabled={!canRedo}
				title={redoLabel || "Nothing to redo"}
				style={{
					backgroundColor: canRedo ? "var(--color-blue)" : "var(--color-blue-weak)",
				}}
			>
				↷ {redoLabel ? redoLabel.split(": ")[1] : "Redo"}
			</button>
		</div>
	);
}
