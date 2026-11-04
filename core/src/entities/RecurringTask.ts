export type RecurringTask = {
	id: string;
	name: string;
	status: "todo" | "done" | "postponed" | "unnecessary";
	weight: number;
};
