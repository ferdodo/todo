import { createContext } from "react";
import type { TodoContext } from "@todo/core";

export const TodoContextReact = createContext<TodoContext | null>(null);
