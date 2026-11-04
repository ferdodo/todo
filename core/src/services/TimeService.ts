import type { Temporal } from "temporal-polyfill";

export interface TimeService {
	getRealDay(): Temporal.PlainDate;
	observeRealDay(listener: (realDay: Temporal.PlainDate) => void): () => void;
	getCurrentTimestamp(): number;
}

