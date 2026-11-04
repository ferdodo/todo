import type { ReactNode } from "react";
import { TodoMessageAlert, TodoModalButtons } from "@todo/ui";

interface ImportModalContentProps {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	onClose: () => void;
	onImport: () => Promise<void>;
}

export function ImportModalContent({
	isLoading,
	message,
	isSuccess,
	onClose,
	onImport,
}: ImportModalContentProps): ReactNode {
	return (
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
				Import Tasks
			</h2>

			<p style={{ margin: "0 0 24px 0", color: "#6b7280", fontSize: "14px" }}>
				Import tasks from a JSON file (Habitica format or exported from this app).
			</p>

			{message && <TodoMessageAlert message={message} isSuccess={isSuccess} />}

			<TodoModalButtons isLoading={isLoading} onClose={onClose} onImport={onImport} />
		</div>
	);
}
