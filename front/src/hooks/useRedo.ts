import { useCallback } from "react";
import { redo } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useRedo(): () => void {
	const context = useTodoContext();

	return useCallback(() => {
		redo(context);
	}, [context]);
}
