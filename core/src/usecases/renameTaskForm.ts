import type { TodoContext } from "../contexts/TodoContext";

export function renameTaskForm(context: TodoContext, name: string): void {
	const taskForm = context.taskFormRepository.get();
	context.taskFormRepository.update({ ...taskForm, name });
}
