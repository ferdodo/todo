import { useEffect, useState, type ReactNode } from "react";
import { startDay } from "@todo/core";
import { useTodoContext } from "../hooks/useTodoContext";
import { useAppearanceAnimation } from "../hooks/useAppearanceAnimation";
import type { PunctualTask, RecurringTask } from "@todo/core";

interface NextDayCardProps {
	recurringTasks: RecurringTask[];
	punctualTasks: PunctualTask[];
}

function NextDayCardContent(): ReactNode {
	const context = useTodoContext();
	const [isDisappearing, setIsDisappearing] = useState(false);
	const { getMaxHeight, getOverflow } = useAppearanceAnimation();

	const handleStartDay = (): void => {
		setIsDisappearing(true);
		setTimeout(() => {
			startDay(context);
		}, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--transform-duration')));
	};

	return (
		<div
			style={{
				maxHeight: getMaxHeight(500, isDisappearing),
				overflow: getOverflow(isDisappearing),
				transition: `max-height var(--transform-duration) var(--transform-function)`,
			}}
		>
			<div
				style={{
					backgroundColor: "var(--color-blue)",
					borderRadius: "var(--border-radius)",
					padding: "var(--spacing)",
					boxShadow: "var(--box-shadow)",
					display: "flex",
					flexDirection: "column",
					gap: "var(--spacing-s)",
					color: "white",
					fontSize: "var(--font-size)",
					fontWidth: "var(--font-weight)",
					marginBottom: "var(--spacing)",
				}}
			>
				<span>
					<b> All Done ! </b>
				</span>
				<span style={{color: "var(--color-minimal)"}}>
					Each day brings new tasks. Clear them all to progress.
				</span>

				<div style={{
					display: "grid",
					justifyContent: "end",
					borderTop: "var(--border-size) dotted color-mix(in hsl, white, transparent 50%)",
					paddingTop: "var(--spacing-s)"
				}}>
					<button
						type="button"
						onClick={handleStartDay}
						style={{
							backgroundColor: "var(--color-blue)",
							border: "var(--border-size) solid color-mix(in hsl, white, transparent 50%)",
						}}
					>
						Start Day
					</button>
				</div>
			</div>
		</div>
	);
}

export function NextDayCard({
	recurringTasks,
	punctualTasks,
}: NextDayCardProps): ReactNode {
	const [showCard, setShowCard] = useState(false);

	useEffect(() => {
		const recurringTodo = recurringTasks.filter((t) => t.status === "todo").length;
		const punctualTodo = punctualTasks.filter((t) => t.status === "todo").length;
		const allClear = recurringTodo === 0 && punctualTodo === 0;
		setShowCard(allClear);
	}, [recurringTasks, punctualTasks]);

	if (!showCard) {
		return null;
	}

	return <NextDayCardContent />;
}
