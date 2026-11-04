import { useState, useEffect } from "react";
import type { TaskForm } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useTaskForm(): TaskForm {
	const context = useTodoContext();
	const [taskForm, setTaskForm] = useState<TaskForm>(() =>
		context.taskFormRepository.get(),
	);

	useEffect(() => {
		const unsubscribe = context.taskFormRepository.observe(setTaskForm);
		return unsubscribe;
	}, [context.taskFormRepository]);

	return taskForm;
}
