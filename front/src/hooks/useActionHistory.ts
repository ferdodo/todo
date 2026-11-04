import { useEffect, useState } from "react";
import type { Action } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useActionHistory(): Action[] {
	const context = useTodoContext();
	const [history, setHistory] = useState<Action[]>([]);

	useEffect(() => {
		const unsubscribe = context.actionHistoryRepository.observe((actions) => {
			setHistory(actions);
		});
		return unsubscribe;
	}, [context]);

	return history;
}
