import type { ReactNode } from "react";

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmationModal({
	isOpen,
	title,
	onConfirm,
	onCancel,
}: ConfirmationModalProps): ReactNode {
	if (!isOpen) return null;

	return (
		<div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<div style={{ backgroundColor: "white", borderRadius: "var(--border-radius)", padding: "var(--spacing)", minWidth: "300px" }}>
				<p style={{ marginTop: 0, marginBottom: "var(--spacing)" }}>{title}</p>
				<div style={{ display: "flex", gap: "var(--spacing-s)", justifyContent: "flex-end" }}>
					<button type="button" onClick={onCancel} style={{ backgroundColor: "var(--color-blue-weak)", color: "white", border: "none" }}>
						Cancel
					</button>
					<button type="button" onClick={onConfirm} style={{ backgroundColor: "var(--color-blue)", color: "white" }}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}
