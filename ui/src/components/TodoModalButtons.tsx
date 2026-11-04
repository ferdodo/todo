import type { ReactNode } from "react";

interface TodoModalButtonsProps {
	isLoading: boolean;
	onClose: () => void;
	onImport: () => Promise<void>;
	cancelLabel?: string;
	actionLabel?: string;
}

export function TodoModalButtons({
	isLoading,
	onClose,
	onImport,
	cancelLabel = "Cancel",
	actionLabel = "Import",
}: TodoModalButtonsProps): ReactNode {
	return (
		<div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
			<button
				type="button"
				onClick={onClose}
				disabled={isLoading}
				style={{
					backgroundColor: "var(--color-blue-weak)",
				}}
			>
				{cancelLabel}
			</button>
			<button
				type="button"
				onClick={onImport}
				disabled={isLoading}
				style={{
					backgroundColor: "var(--color-green)",
				}}
			>
				{isLoading ? `${actionLabel}ing...` : actionLabel}
			</button>
		</div>
	);
}
