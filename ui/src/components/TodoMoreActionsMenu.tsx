import type { ReactNode } from "react";
import { TodoUndoRedoButtons } from "./TodoUndoRedoButtons";
import { zIndex } from "../utils/zIndex";

interface TodoMoreActionsMenuProps {
	isOpen: boolean;
	onToggle: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	undoLabel?: string;
	redoLabel?: string;
	menuPosition?: { top: number; right: number } | null;
	children?: ReactNode;
}

export function TodoMoreActionsMenu({
	isOpen,
	onToggle,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	undoLabel,
	redoLabel,
	menuPosition,
	children,
}: TodoMoreActionsMenuProps): ReactNode {
	return (
		<>
			<button
				type="button"
				onClick={onToggle}
				style={{
					backgroundColor: "var(--color-blue-weak)",
				}}
				title="More actions"
			>
				⋮
			</button>

			{isOpen && menuPosition && (
				<>
					<button
						type="button"
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: zIndex.dropdownBackdrop,
							background: "none",
							border: "none",
							padding: 0,
							cursor: "default",
						}}
						onClick={onToggle}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Escape") onToggle();
						}}
						aria-label="Close menu"
					/>
					<div
						style={{
							position: "fixed",
							top: `${menuPosition.top}px`,
							right: `${menuPosition.right}px`,
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							borderRadius: "6px",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							zIndex: zIndex.dropdownMenu,
							minWidth: "200px",
							padding: "8px",
							pointerEvents: "auto",
						}}
					>
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

						{children && (
							<div
								style={{
									borderTop: "1px solid #e5e7eb",
									padding: "8px",
									display: "flex",
									flexDirection: "column",
									gap: "4px",
								}}
							>
								{children}
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
