import type { ReactNode } from "react";
import { TodoContextReact } from "../contexts/TodoContextReact";
import { createTodoContext } from "../factories/createTodoContext";

interface TodoContextProviderProps {
	children: ReactNode;
}

export function TodoContextProvider({ children }: TodoContextProviderProps): ReactNode {
	const todoContext = createTodoContext();

	return <TodoContextReact.Provider value={todoContext}>{children}</TodoContextReact.Provider>;
}
