import { useState, useEffect } from "react";
import { useTodoContext } from "./useTodoContext";
import type { PunctualTask } from "@todo/core";

export function usePunctualTasks(): PunctualTask[] {
	const context = useTodoContext();
	const [tasks, setTasks] = useState<PunctualTask[]>([]);

	useEffect(() => {
		const unsubscribe = context.todoPunctualTaskRepository.observe((tasks) => {
			setTasks(tasks);
		});
		setTasks(context.todoPunctualTaskRepository.getAll());
		return unsubscribe;
	}, [context.todoPunctualTaskRepository]);

	return tasks;
}
