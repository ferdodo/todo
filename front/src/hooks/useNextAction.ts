import { useEffect, useState } from "react";
import type { Action } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useNextAction(): Action | null {
	const context = useTodoContext();
	const [nextAction, setNextAction] = useState<Action | null>(null);

	useEffect(() => {
		const unsubscribe = context.actionHistoryRepository.observeRedo(() => {
			setNextAction(context.actionHistoryRepository.getRedoAction());
		});
		return unsubscribe;
	}, [context]);

	return nextAction;
}
