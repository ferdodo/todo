import type { ReactNode } from "react";
import { zIndex } from "../utils/zIndex";

interface TodoStartDayModalProps {
	isOpen: boolean;
	unfinishedTasksCount: number;
	completedTasksCount: number;
	healthLoss: number;
	onStartDay: () => void;
	onCancel: () => void;
}

export function TodoStartDayModal({
	isOpen,
	unfinishedTasksCount,
	completedTasksCount,
	healthLoss,
	onStartDay,
	onCancel,
}: TodoStartDayModalProps): ReactNode {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: zIndex.modal,
			}}
		>
			<div
				style={{
					backgroundColor: "#fff",
					borderRadius: "8px",
					padding: "24px",
					maxWidth: "450px",
					width: "90%",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
				}}
				role="dialog"
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === "Escape") {
						onCancel();
					}
				}}
			>
				<h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600" }}>
					Start New Day
				</h2>

				<p
					style={{
						margin: "0 0 20px 0",
						fontSize: "14px",
						color: "#6b7280",
						lineHeight: "1.5",
					}}
				>
					You have {unfinishedTasksCount} unfinished recurring {unfinishedTasksCount === 1 ? "task" : "tasks"}.
				</p>

				<div
					style={{
						backgroundColor: "#fef3c7",
						borderLeft: "4px solid #f59e0b",
						borderRadius: "4px",
						padding: "16px",
						marginBottom: "24px",
					}}
				>
					<p
						style={{
							margin: "0 0 8px 0",
							fontSize: "14px",
							fontWeight: "600",
							color: "#92400e",
						}}
					>
						Health Loss: -{healthLoss} HP
					</p>
					<p
						style={{
							margin: "0",
							fontSize: "12px",
							color: "#b45309",
						}}
					>
						Your hero will take damage for each unfinished task. All recurring tasks will reset to "To Do".
					</p>
				</div>

				<div
					style={{
						backgroundColor: "#f3f4f6",
						borderRadius: "6px",
						padding: "16px",
						marginBottom: "24px",
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px",
							marginBottom: "16px",
						}}
					>
						<div>
							<p
								style={{
									margin: "0 0 4px 0",
									fontSize: "12px",
									color: "#6b7280",
									fontWeight: "500",
								}}
							>
								Completed Tasks
							</p>
							<p style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#10b981" }}>
								{completedTasksCount}
							</p>
						</div>
						<div>
							<p
								style={{
									margin: "0 0 4px 0",
									fontSize: "12px",
									color: "#6b7280",
									fontWeight: "500",
								}}
							>
								Unfinished Tasks
							</p>
							<p style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#ef4444" }}>
								{unfinishedTasksCount}
							</p>
						</div>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px",
						}}
					>
						<div></div>
						<div>
							<p
								style={{
									margin: "0 0 4px 0",
									fontSize: "12px",
									color: "#6b7280",
									fontWeight: "500",
								}}
							>
								Damage per Task
							</p>
							<p style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#ef4444" }}>
								-10 HP
							</p>
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						gap: "8px",
						justifyContent: "flex-end",
					}}
				>
					<button
						type="button"
						onClick={onCancel}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Enter") {
								onCancel();
							}
						}}
						style={{
							padding: "8px 16px",
							backgroundColor: "var(--color-blue-weak)",
							color: "#374151",
							border: "none",
							borderRadius: "4px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							transition: `all var(--transform-duration) var(--transform-function)`,
						}}
						onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#d1d5db";
						}}
						onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#e5e7eb";
						}}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onStartDay}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Enter") {
								onStartDay();
							}
						}}
						style={{
							padding: "8px 16px",
							backgroundColor: "var(--color-blue)",
							color: "white",
							border: "none",
							borderRadius: "4px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							transition: `all var(--transform-duration) var(--transform-function)`,
						}}
						onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#2563eb";
						}}
						onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#3b82f6";
						}}
					>
						Start Day
					</button>
				</div>
			</div>
		</div>
	);
}
