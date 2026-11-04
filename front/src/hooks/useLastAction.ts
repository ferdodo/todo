import { useEffect, useState } from "react";
import type { Action } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useLastAction(): Action | null {
	const context = useTodoContext();
	const [lastAction, setLastAction] = useState<Action | null>(null);

	useEffect(() => {
		const unsubscribe = context.actionHistoryRepository.observe(() => {
			setLastAction(context.actionHistoryRepository.getUndoAction());
		});
		return unsubscribe;
	}, [context]);

	return lastAction;
}
