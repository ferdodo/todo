import { useState, type ReactNode } from "react";
import { splitTask } from "@todo/core";
import { TodoSplitTaskModal } from "@todo/ui";
import { useTodoContext } from "../hooks/useTodoContext";

interface SplitTaskModalProps {
	isOpen: boolean;
	taskId: string;
	taskName: string;
	onClose: () => void;
}

export function SplitTaskModal({
	isOpen,
	taskId,
	taskName,
	onClose,
}: SplitTaskModalProps): ReactNode {
	const context = useTodoContext();
	const [newTaskName, setNewTaskName] = useState("");

	const handleSplit = (): void => {
		if (newTaskName.trim() === "") {
			return;
		}
		splitTask(context, taskId, newTaskName);
		setNewTaskName("");
		onClose();
	};

	const handleClose = (): void => {
		setNewTaskName("");
		onClose();
	};

	return (
		<TodoSplitTaskModal
			isOpen={isOpen}
			taskName={taskName}
			newTaskName={newTaskName}
			onNameChange={setNewTaskName}
			onSplit={handleSplit}
			onClose={handleClose}
		/>
	);
}
