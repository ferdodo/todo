import type { TodoContext } from "../contexts/TodoContext";

interface EnrichedHabiticaTask {
	text: string;
	type: "daily" | "todo";
	weight?: number;
	status?: "todo" | "done" | "postponed" | "unnecessary";
}

interface EnrichedHabiticaExport {
	tasks: {
		dailys: EnrichedHabiticaTask[];
		todos: EnrichedHabiticaTask[];
	};
	hero?: {
		health: number;
		level: number;
		xp: number;
	};
}

export function exportTasks(context: TodoContext): string {
	const hero = context.heroRepository.get();
	const recurringTasks = context.todoRecurringTaskRepository.getAll();
	const punctualTasks = context.todoPunctualTaskRepository.getAll();

	const dailys: EnrichedHabiticaTask[] = recurringTasks.map((task) => ({
		text: task.name,
		type: "daily" as const,
		weight: task.weight,
		status: task.status,
	}));

	const todos: EnrichedHabiticaTask[] = punctualTasks.map((task) => ({
		text: task.name,
		type: "todo" as const,
		weight: task.weight,
		status: task.status,
	}));

	const exportData: EnrichedHabiticaExport = {
		tasks: {
			dailys,
			todos,
		},
		hero: {
			health: hero.health,
			level: hero.level,
			xp: hero.xp,
		},
	};

	return JSON.stringify(exportData, null, 2);
}
