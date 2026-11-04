import { useCallback } from "react";
import { undo } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useUndo(): () => void {
	const context = useTodoContext();

	return useCallback(() => {
		undo(context);
	}, [context]);
}
