import { useState, useEffect } from "react";
import { useTodoContext } from "./useTodoContext";
import type { RecurringTask } from "@todo/core";

export function useRecurringTasks(): RecurringTask[] {
	const context = useTodoContext();
	const [tasks, setTasks] = useState<RecurringTask[]>([]);

	useEffect(() => {
		const unsubscribe = context.todoRecurringTaskRepository.observe((tasks) => {
			setTasks(tasks);
		});
		setTasks(context.todoRecurringTaskRepository.getAll());
		return unsubscribe;
	}, [context.todoRecurringTaskRepository]);

	return tasks;
}
