import type { ReactNode } from "react";
import { TodoTaskForm } from "@todo/ui";
import { addTask, renameTaskForm } from "@todo/core";
import { useTodoContext } from "../hooks/useTodoContext";
import { useTaskForm } from "../hooks/useTaskForm";

interface TaskFormProps {
	isOpen: boolean;
	onClose: () => void;
}

export function TaskForm({ isOpen, onClose }: TaskFormProps): ReactNode {
	const context = useTodoContext();
	const taskForm = useTaskForm();

	const handleTaskTypeChange = (newTaskType: "recurring" | "punctual"): void => {
		context.taskFormRepository.update({ ...taskForm, taskType: newTaskType });
	};

	const handleNameChange = (newName: string): void => {
		renameTaskForm(context, newName);
	};

	const handleSubmit = (): void => {
		addTask(context);
		context.taskFormRepository.update({ taskType: "recurring", name: "" });
		onClose();
	};

	const handleCancel = (): void => {
		context.taskFormRepository.update({ taskType: "recurring", name: "" });
		onClose();
	};

	return (
		<TodoTaskForm
			isOpen={isOpen}
			taskType={taskForm.taskType}
			name={taskForm.name}
			onTaskTypeChange={handleTaskTypeChange}
			onNameChange={handleNameChange}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	);
}
