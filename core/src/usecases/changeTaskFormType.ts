import type { TodoContext } from "../contexts/TodoContext";
import type { TaskForm } from "../entities/TaskForm";

export function changeTaskFormType(
	context: TodoContext,
	taskType: TaskForm["taskType"],
): void {
	const taskForm = context.taskFormRepository.get();
	context.taskFormRepository.update({ ...taskForm, taskType });
}
