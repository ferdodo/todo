export type PunctualTask = {
	id: string;
	name: string;
	status: "todo" | "done" | "postponed";
	weight: number;
};
