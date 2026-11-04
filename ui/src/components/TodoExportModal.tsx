import type { ReactNode } from "react";
import { zIndex } from "../utils/zIndex";

const containerStyle = {
	backgroundColor: "white",
	borderRadius: "8px",
	padding: "32px",
	maxWidth: "400px",
	width: "90%",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyle = { margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700" };

const descriptionStyle = { margin: "0 0 24px 0", fontSize: "14px", color: "#666" };

const getMessageStyle = (isSuccess: boolean): { marginBottom: string; padding: string; borderRadius: string; backgroundColor: string; color: string; fontSize: string } => ({
	marginBottom: "24px",
	padding: "12px",
	borderRadius: "6px",
	backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
	color: isSuccess ? "#065f46" : "#991b1b",
	fontSize: "14px",
});

const buttonContainerStyle = { display: "flex", gap: "12px" };

const getPrimaryBtnStyle = (isLoading: boolean): { backgroundColor: string; opacity: number } => ({
	backgroundColor: "var(--color-blue)",
	opacity: isLoading ? 0.5 : 1,
});

const getSecondaryBtnStyle = (isLoading: boolean): { backgroundColor: string; opacity: number } => ({
	backgroundColor: "var(--color-blue-weak)",
	opacity: isLoading ? 0.5 : 1,
});

interface TodoExportModalProps {
	isOpen: boolean;
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	onClose: () => void;
	onExport: () => Promise<void>;
}

export function TodoExportModal({
	isOpen,
	isLoading,
	message,
	isSuccess,
	onClose,
	onExport,
}: TodoExportModalProps): ReactNode {
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
			<div style={containerStyle}>
				<h2 style={titleStyle}>Export Tasks</h2>

				<p style={descriptionStyle}>
					Export all your tasks, statuses, and hero stats to a JSON file that can be
					imported later.
				</p>

				{message && <div style={getMessageStyle(isSuccess)}>{message}</div>}

				<div style={buttonContainerStyle}>
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						style={getSecondaryBtnStyle(isLoading)}
					>
						Close
					</button>
					<button
						type="button"
						onClick={onExport}
						disabled={isLoading}
						style={getPrimaryBtnStyle(isLoading)}
					>
						{isLoading ? "Exporting..." : "Export"}
					</button>
				</div>
			</div>
		</div>
	);
}
