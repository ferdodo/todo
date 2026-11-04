import type { ReactNode } from "react";
import { zIndex } from "../utils/zIndex";

interface TodoRenameTaskModalProps {
	isOpen: boolean;
	taskName: string;
	newTaskName: string;
	onNameChange: (name: string) => void;
	onRename: () => void;
	onClose: () => void;
	canSubmit: boolean;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TodoRenameTaskModal({
	isOpen,
	taskName,
	newTaskName,
	onNameChange,
	onRename,
	onClose,
	canSubmit,
	onKeyDown,
}: TodoRenameTaskModalProps): ReactNode {
	if (!isOpen) {
		return null;
	}

	return (
		<button
			type="button"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: zIndex.modal,
				border: "none",
				padding: 0,
				cursor: "default",
			}}
			onClick={onClose}
			aria-label="Close modal"
		>
			<div
				role="dialog"
				style={{
					backgroundColor: "white",
					borderRadius: "8px",
					padding: "24px",
					maxWidth: "400px",
					width: "90%",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
				onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === "Escape") onClose();
				}}
			>
				<h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600" }}>
					Rename Task
				</h2>
				<p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "14px" }}>
					Current: "{taskName}"
				</p>
				<input
					type="text"
					value={newTaskName}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onNameChange(e.target.value)
					}
					placeholder="New name"
					onKeyDown={onKeyDown}
					style={{
						width: "100%",
						padding: "8px 12px",
						border: "1px solid #d1d5db",
						borderRadius: "4px",
						fontSize: "14px",
						marginBottom: "16px",
						boxSizing: "border-box",
					}}
				/>
				<div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
					<button type="button" onClick={onClose}>
						Cancel
					</button>
					<button type="button" onClick={onRename} disabled={!canSubmit}>
						Rename
					</button>
				</div>
			</div>
		</button>
	);
}
