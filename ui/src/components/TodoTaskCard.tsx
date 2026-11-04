import type { ReactNode } from "react";
import { weightToDifficulty } from "../utils/weightToDifficulty";
import { getSwipeBackgroundColor } from "../utils/getSwipeBackgroundColor";

interface TodoTaskCardProps {
	name: string;
	weight: number;
	onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => void;
	onTouchMove: (e: React.TouchEvent<HTMLButtonElement>) => void;
	onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => void;
	swipeOffset: number;
	isExtended?: boolean;
	onExtendToggle?: () => void;
	optionsNode?: ReactNode;
}

export function TodoTaskCard({
	name,
	weight,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	swipeOffset,
	isExtended = false,
	onExtendToggle,
	optionsNode,
}: TodoTaskCardProps): ReactNode {
	const swipeBackgroundColor = getSwipeBackgroundColor(swipeOffset);
	const difficulty = weightToDifficulty(weight);

	return (
		<div style={{ display: "grid", gridTemplateAreas: "'card'", paddingBottom: "var(--spacing)" }}>
			<button
				type="button"
				className="card"
				aria-expanded={isExtended}
				aria-label={`${name}${isExtended ? " - Options expanded" : " - Click to expand options"}`}
				style={{
					appearance: "none",
					border: "none",
					font: "inherit",
					textAlign: "left",
					cursor: "pointer",
					transform: `translateX(${swipeOffset}px)`,
					transition: "transform 0.1s ease-out",
					overflow: "hidden",
					gridArea: "card",
					display: "flex",
					flexDirection: "column",
				}}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onClick={onExtendToggle}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "0",
						gap: "var(--spacing)"
					}}
				>
					<span style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "var(--spacing)",
						fontSize: "var(--font-size)",
						fontWeight: "var(--font-weight)",
						flex: 1,
						padding: "inherit",
					}}>
						<span
							style={{
								backgroundColor: difficulty.color,
								width: "12px",
								height: "12px",
								borderRadius: "50%",
								flexShrink: 0,
							}}
						/>
						{name}
					</span>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: "24px",
							height: "24px",
							flexShrink: 0,
							marginRight: "8px",
						}}
					>
						↕
					</span>
				</div>

				{optionsNode && (
					<div
						style={{
							maxHeight: isExtended ? "150px" : "0",
							overflow: "hidden",
							transition: `max-height var(--transform-duration) var(--transform-function), padding-top var(--transform-duration) var(--transform-function)`,
							display: "flex",
							flexDirection: "column",
							gap: "var(--spacing)",
						}}
					>
						<div style={{ paddingTop:"var(--spacing)" }}>
							{optionsNode}
						</div>
					</div>
				)}
			</button>

			<div
				style={{
					gridArea: "card",
					display: "grid",
					gridTemplateAreas: "'undercard'",
				}}
			>
				<div style={{
					borderRadius: "var(--border-radius)",
					transition: `background-color var(--transform-duration) var(--transform-function)`,
					backgroundColor: swipeBackgroundColor,
					gridArea: "undercard",
					boxShadow: "var(--box-shadow)",
				}} />
			</div>
		</div>
	);
}
