import type { ReactNode } from "react";
import { TodoContextProvider } from "../providers/TodoContextProvider";
import { TodoPage } from "./TodoPage";

export function TodoApp(): ReactNode {
	return (
		<TodoContextProvider>
			<TodoPage />
		</TodoContextProvider>
	);
}
