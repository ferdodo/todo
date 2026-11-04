import type { ReactNode } from "react";
import { zIndex } from "../utils/zIndex";

interface TodoTaskFormProps {
	taskType: "recurring" | "punctual";
	name: string;
	onTaskTypeChange: (type: "recurring" | "punctual") => void;
	onNameChange: (name: string) => void;
	onSubmit: () => void;
	onCancel: () => void;
	isOpen: boolean;
}

export function TodoTaskForm({
	taskType,
	name,
	onTaskTypeChange,
	onNameChange,
	onSubmit,
	onCancel,
	isOpen,
}: TodoTaskFormProps): ReactNode {
	if (!isOpen) {
		return null;
	}

	const isValid = name.trim().length > 0;

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
					maxWidth: "500px",
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
				<h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600" }}>
					Ajouter une tâche
				</h2>

				<div style={{ marginBottom: "20px" }}>
					<label
						htmlFor="task-type"
						style={{
							display: "block",
							marginBottom: "8px",
							fontSize: "14px",
							fontWeight: "500",
							color: "#374151",
						}}
					>
						Type de tâche
					</label>
					<select
						id="task-type"
						value={taskType}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							onTaskTypeChange(e.target.value as "recurring" | "punctual");
						}}
						style={{
							width: "100%",
							padding: "8px 12px",
							borderRadius: "4px",
							border: "1px solid #d1d5db",
							fontSize: "14px",
							fontFamily: "inherit",
						}}
					>
						<option value="recurring">Tâche récurrente</option>
						<option value="punctual">Tâche ponctuelle</option>
					</select>
				</div>

				<div style={{ marginBottom: "24px" }}>
					<label
						htmlFor="task-name"
						style={{
							display: "block",
							marginBottom: "8px",
							fontSize: "14px",
							fontWeight: "500",
							color: "#374151",
						}}
					>
						Nom de la tâche
					</label>
					<input
						id="task-name"
						type="text"
						value={name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							onNameChange(e.target.value);
						}}
						placeholder="Ex: Daily meeting, Buy groceries..."
						style={{
							width: "100%",
							padding: "8px 12px",
							borderRadius: "4px",
							border: "1px solid #d1d5db",
							fontSize: "14px",
							fontFamily: "inherit",
							boxSizing: "border-box",
						}}
					/>
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
						Annuler
					</button>
					<button
						type="button"
						onClick={onSubmit}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Enter" && isValid) {
								onSubmit();
							}
						}}
						disabled={!isValid}
						style={{
							padding: "8px 16px",
							backgroundColor: isValid ? "#3b82f6" : "#d1d5db",
							color: "white",
							border: "none",
							borderRadius: "4px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: isValid ? "pointer" : "not-allowed",
							transition: `all var(--transform-duration) var(--transform-function)`,
						}}
						onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
							if (isValid) {
								e.currentTarget.style.backgroundColor = "#2563eb";
							}
						}}
						onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
							if (isValid) {
								e.currentTarget.style.backgroundColor = "#3b82f6";
							}
						}}
					>
						Créer
					</button>
				</div>
			</div>
		</div>
	);
}
