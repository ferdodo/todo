import type { ReactNode } from "react";

interface TodoResurrectionModalProps {
	isOpen: boolean;
	onResurrect: () => void;
	onCancel: () => void;
}

export function TodoResurrectionModal({
	isOpen,
	onResurrect,
	onCancel,
}: TodoResurrectionModalProps): ReactNode {
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
				zIndex: 1000,
			}}
		>
			<div
				style={{
					backgroundColor: "#fff",
					borderRadius: "8px",
					padding: "24px",
					maxWidth: "400px",
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
					Hero Fallen
				</h2>

				<p
					style={{
						margin: "0 0 24px 0",
						fontSize: "14px",
						color: "#6b7280",
						lineHeight: "1.5",
					}}
				>
					Your hero has been defeated. Resurrect to start a new adventure with fresh health and reduced level.
				</p>

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
								After Resurrection
							</p>
							<p style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>
								❤️ 100 HP
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
								Level Reset
							</p>
							<p style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>
								⬇️ Level 1
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
						onClick={onResurrect}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Enter") {
								onResurrect();
							}
						}}
						style={{
							padding: "8px 16px",
							backgroundColor: "var(--color-green)",
							color: "white",
							border: "none",
							borderRadius: "4px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							transition: `all var(--transform-duration) var(--transform-function)`,
						}}
						onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#059669";
						}}
						onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = "#10b981";
						}}
					>
						Resurrect
					</button>
				</div>
			</div>
		</div>
	);
}
