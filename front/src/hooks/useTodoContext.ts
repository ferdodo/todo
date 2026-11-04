import { useContext } from "react";
import { TodoContextReact } from "../contexts/TodoContextReact";
import type { TodoContext } from "@todo/core";

export function useTodoContext(): TodoContext {
	const context = useContext(TodoContextReact);
	if (!context) {
		throw new Error("useTodoContext must be used within TodoContextProvider");
	}
	return context;
}
