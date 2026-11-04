import { useState, type ReactNode } from "react";
import { TodoTaskCard } from "@todo/ui";
import { doTask, deleteTask, postponeTask } from "@todo/core";
import { useTodoContext } from "../hooks/useTodoContext";
import { useSwipeOut } from "../hooks/useSwipeOut";
import { useAppearanceAnimation } from "../hooks/useAppearanceAnimation";
import { RenameTaskModal } from "./RenameTaskModal";

interface RecurringTaskCardProps {
	id: string;
	name: string;
	weight: number;
}

export function RecurringTaskCard({ id, name, weight }: RecurringTaskCardProps): ReactNode {
	const context = useTodoContext();
	const [isExtended, setIsExtended] = useState(false);
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const { getMaxHeight, getOverflow } = useAppearanceAnimation();

	const handleDelete = (): void => {
		deleteTask(context, id);
	};

	const handleDo = (): void => {
		doTask(context, id);
	};

	const handlePostpone = (): void => {
		postponeTask(context, id);
	};

	const handleRename = (): void => {
		setIsRenameModalOpen(true);
	};

	const { swipeOffset, swipeOutStyle, swipeOutDirection, handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeOut({
		onDone: handleDo,
		onPostpone: handlePostpone,
	});

	return (
		<>
			<div
				style={{
					...swipeOutStyle,
					maxHeight: getMaxHeight(300, Boolean(swipeOutDirection)),
					overflow: getOverflow(Boolean(swipeOutDirection)),
					transition: `max-height var(--transform-duration) var(--transform-function), transform 2s ease-out`,
				}}
			>
				<TodoTaskCard
					name={name}
					weight={weight}
					swipeOffset={swipeOffset}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					isExtended={isExtended}
					onExtendToggle={() => setIsExtended(!isExtended)}
					optionsNode={
						<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
							<button type="button" onClick={handleRename} style={{ flex: "1 1 auto", padding: "6px 12px", fontSize: "12px", backgroundColor: "var(--color-blue)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
								Rename
							</button>
							<button type="button" onClick={handleDo} style={{ flex: "1 1 auto", padding: "6px 12px", fontSize: "12px", backgroundColor: "var(--color-green)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
								Do
							</button>
							<button type="button" onClick={handlePostpone} style={{ flex: "1 1 auto", padding: "6px 12px", fontSize: "12px", backgroundColor: "var(--color-orange)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
								Postpone
							</button>
							<button type="button" onClick={handleDelete} style={{ flex: "1 1 auto", padding: "6px 12px", fontSize: "12px", backgroundColor: "var(--color-red-strong)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
								Delete
							</button>
						</div>
					}
				/>
			</div>
			<RenameTaskModal
				isOpen={isRenameModalOpen}
				taskId={id}
				taskName={name}
				onClose={() => setIsRenameModalOpen(false)}
			/>
		</>
	);
}
