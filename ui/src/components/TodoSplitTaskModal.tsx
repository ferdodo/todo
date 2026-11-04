import type { ReactNode } from "react";
import { zIndex } from "../utils/zIndex";

interface TodoSplitTaskModalProps {
	isOpen: boolean;
	taskName: string;
	newTaskName: string;
	onNameChange: (name: string) => void;
	onSplit: () => void;
	onClose: () => void;
}

export function TodoSplitTaskModal({
	isOpen,
	taskName,
	newTaskName,
	onNameChange,
	onSplit,
	onClose,
}: TodoSplitTaskModalProps): ReactNode {
	const isNameEmpty = newTaskName.trim() === "";

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
					if (e.key === "Escape") {
						onClose();
					}
				}}
			>
				<h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600" }}>
					Split Task
				</h2>
				<p style={{ color: "#6b7280", marginBottom: "16px", fontSize: "14px" }}>
					Split "{taskName}" into two tasks:
				</p>
				<p style={{ color: "#6b7280", marginBottom: "12px", fontSize: "12px" }}>
					Original task will keep 30% of the weight, new task will get 70%.
				</p>
				<input
					type="text"
					value={newTaskName}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
					placeholder="Name of new task"
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && !isNameEmpty && onSplit()}
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
					<button
						type="button"
						onClick={onClose}
						style={{
							backgroundColor: "var(--color-blue-weak)",
						}}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onSplit}
						disabled={isNameEmpty}
						style={{
							backgroundColor: isNameEmpty ? "var(--color-blue-weak)" : "var(--color-blue)",
						}}
					>
						Split
					</button>
				</div>
			</div>
		</button>
	);
}
