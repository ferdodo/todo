import { useRef, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const Z_INDEX = {
	dropdownBackdrop: 4999,
	dropdownMenu: 5000,
};

interface PunctualTaskMenuButtonProps {
	isOpen: boolean;
	onToggle: () => void;
	onRename: () => void;
	onDone: () => void;
	onPostpone: () => void;
	onSplit: () => void;
	onDelete: () => void;
}

const getMenuPosition = (buttonElement: HTMLButtonElement | null): { top: number; right: number } | null => {
	if (!buttonElement) return null;
	const rect = buttonElement.getBoundingClientRect();
	return {
		top: rect.bottom + 4,
		right: window.innerWidth - rect.right,
	};
};

export function PunctualTaskMenuButton({
	isOpen,
	onToggle,
	onRename,
	onDone,
	onPostpone,
	onSplit,
	onDelete,
}: PunctualTaskMenuButtonProps): ReactNode {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
	const portalRoot = typeof document !== "undefined" ? document.getElementById("portal-root") : null;

	useLayoutEffect(() => {
		if (isOpen) {
			setMenuPos(getMenuPosition(buttonRef.current));
		}
	}, [isOpen]);

	return (
		<>
			<button
				ref={buttonRef}
				type="button"
				onClick={onToggle}
				style={{
					padding: "4px 12px",
					backgroundColor: "var(--color-blue-weak)",
					color: "white",
					border: "none",
					borderRadius: "4px",
					fontSize: "12px",
					fontWeight: "600",
					cursor: "pointer",
					minWidth: "40px",
				}}
			>
				⋮
			</button>

			{isOpen && menuPos && portalRoot && createPortal(
				<>
					<button
						type="button"
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: Z_INDEX.dropdownBackdrop,
							background: "none",
							border: "none",
							padding: 0,
							cursor: "default",
						}}
						onClick={onToggle}
						onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
							if (e.key === "Escape") onToggle();
						}}
						aria-label="Close menu"
					/>
					<div
						style={{
							position: "fixed",
							top: `${menuPos.top}px`,
							right: `${menuPos.right}px`,
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							borderRadius: "4px",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							zIndex: Z_INDEX.dropdownMenu,
							minWidth: "120px",
							pointerEvents: "auto",
						}}
					>
						<button
							type="button"
							onClick={() => {
								onRename();
								onToggle();
							}}
							style={{
								display: "block",
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "transparent",
								color: "#374151",
								border: "none",
								fontSize: "12px",
								fontWeight: "500",
								cursor: "pointer",
								textAlign: "left",
								borderBottom: "1px solid #e5e7eb",
							}}
							onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "#f3f4f6";
							}}
							onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							Rename
						</button>
						<button
							type="button"
							onClick={() => {
								onDone();
								onToggle();
							}}
							style={{
								display: "block",
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "transparent",
								color: "#10b981",
								border: "none",
								fontSize: "12px",
								fontWeight: "500",
								cursor: "pointer",
								textAlign: "left",
								borderBottom: "1px solid #e5e7eb",
							}}
							onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "#d1fae5";
							}}
							onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							Done
						</button>
						<button
							type="button"
							onClick={() => {
								onPostpone();
								onToggle();
							}}
							style={{
								display: "block",
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "transparent",
								color: "#f59e0b",
								border: "none",
								fontSize: "12px",
								fontWeight: "500",
								cursor: "pointer",
								textAlign: "left",
								borderBottom: "1px solid #e5e7eb",
							}}
							onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "#fef3c7";
							}}
							onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							Postpone
						</button>
						<button
							type="button"
							onClick={() => {
								onSplit();
								onToggle();
							}}
							style={{
								display: "block",
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "transparent",
								color: "#8b5cf6",
								border: "none",
								fontSize: "12px",
								fontWeight: "500",
								cursor: "pointer",
								textAlign: "left",
								borderBottom: "1px solid #e5e7eb",
							}}
							onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "#ede9fe";
							}}
							onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							Split
						</button>
						<button
							type="button"
							onClick={() => {
								onDelete();
								onToggle();
							}}
							style={{
								display: "block",
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "transparent",
								color: "#ef4444",
								border: "none",
								fontSize: "12px",
								fontWeight: "500",
								cursor: "pointer",
								textAlign: "left",
							}}
							onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "#fee2e2";
							}}
							onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							Delete
						</button>
					</div>
				</>,
				portalRoot
			)}
		</>
	);
}
