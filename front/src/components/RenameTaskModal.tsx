import { useState, type ReactNode, useMemo } from "react";
import { renameTask } from "@todo/core";
import { TodoRenameTaskModal } from "@todo/ui";
import { useTodoContext } from "../hooks/useTodoContext";

interface RenameTaskModalProps {
	isOpen: boolean;
	taskId: string;
	taskName: string;
	onClose: () => void;
}

export function RenameTaskModal({
	isOpen,
	taskId,
	taskName,
	onClose,
}: RenameTaskModalProps): ReactNode {
	const context = useTodoContext();
	const [newTaskName, setNewTaskName] = useState(taskName);

	const canSubmit = useMemo(() => {
		const isEmpty = newTaskName.trim() === "";
		return !isEmpty && newTaskName !== taskName;
	}, [newTaskName, taskName]);

	const handleRename = (): void => {
		if (canSubmit) {
			renameTask(context, taskId, newTaskName);
			setNewTaskName(taskName);
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") {
			handleRename();
		}
	};

	const handleClose = (): void => {
		setNewTaskName(taskName);
		onClose();
	};

	return (
		<TodoRenameTaskModal
			isOpen={isOpen}
			taskName={taskName}
			newTaskName={newTaskName}
			onNameChange={setNewTaskName}
			onRename={handleRename}
			onClose={handleClose}
			canSubmit={canSubmit}
			onKeyDown={handleKeyDown}
		/>
	);
}
