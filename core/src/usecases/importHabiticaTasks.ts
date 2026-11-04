import type { BrowserService } from "../services/BrowserService";
import type { TodoContext } from "../contexts/TodoContext";
import type { RecurringTask, PunctualTask } from "../entities";

interface HabiticaTask {
	text: string;
	type: string;
	weight?: number;
	status?: "todo" | "done" | "postponed" | "unnecessary";
}

interface HabiticaExport {
	tasks: {
		dailys: HabiticaTask[];
		todos: HabiticaTask[];
	};
	hero?: {
		health: number;
		level: number;
		xp: number;
	};
}

let importedTaskIdCounter = 0;

function generateTaskId(prefix: string): string {
	importedTaskIdCounter += 1;
	return `${prefix}-${importedTaskIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function importHabiticaTasks(
	browserService: BrowserService,
	context: TodoContext,
): Promise<{ imported: number; errors: string[] }> {
	const errors: string[] = [];
	let imported = 0;

	try {
		const fileContent = await browserService.readFile();
		const data = JSON.parse(fileContent) as HabiticaExport;

		for (const task of data.tasks.dailys) {
			const recurringTask: RecurringTask = {
				id: generateTaskId("recurring"),
				name: task.text,
				status: (task.status ?? "todo") as "todo" | "done" | "postponed" | "unnecessary",
				weight: task.weight ?? 1,
			};
			context.todoRecurringTaskRepository.create(recurringTask);
			imported += 1;
		}

		for (const task of data.tasks.todos) {
			const punctualTask: PunctualTask = {
				id: generateTaskId("punctual"),
				name: task.text,
				status: (task.status ?? "todo") as "todo" | "done" | "postponed",
				weight: task.weight ?? 1,
			};
			context.todoPunctualTaskRepository.create(punctualTask);
			imported += 1;
		}

		if (data.hero) {
			const hero = context.heroRepository.get();
			context.heroRepository.update({
				...hero,
				health: data.hero.health,
				level: data.hero.level,
				xp: data.hero.xp,
			});
		}
	} catch (parseError) {
		errors.push(
			`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
		);
	}

	return { imported, errors };
}
