import type { ReactNode } from "react";
import { TodoMessageAlert } from "./TodoMessageAlert";
import { TodoModalButtons } from "./TodoModalButtons";
import { zIndex } from "../utils/zIndex";

interface TodoHabiticaImportModalProps {
	isOpen: boolean;
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	onClose: () => void;
	onImport: () => Promise<void>;
}

export function TodoHabiticaImportModal({
	isOpen,
	isLoading,
	message,
	isSuccess,
	onClose,
	onImport,
}: TodoHabiticaImportModalProps): ReactNode {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: zIndex.modal,
			}}
			role="dialog"
			aria-modal="true"
			onClick={(e: React.MouseEvent<HTMLDivElement>) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div
				style={{
					backgroundColor: "white",
					borderRadius: "8px",
					padding: "32px",
					maxWidth: "400px",
					width: "90%",
					boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
				}}
				role="document"
			>
				<h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "700" }}>
					Import Habitica Tasks
				</h2>

				<p style={{ margin: "0 0 24px 0", color: "#6b7280", fontSize: "14px" }}>
					Select a Habitica export JSON file to import your tasks.
				</p>

				{message && <TodoMessageAlert message={message} isSuccess={isSuccess} />}

				<TodoModalButtons isLoading={isLoading} onClose={onClose} onImport={onImport} />
			</div>
		</div>
	);
}
