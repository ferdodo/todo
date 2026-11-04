import { Temporal } from "temporal-polyfill";

interface BrowserTimeService {
	getRealDay(): Temporal.PlainDate;
	observeRealDay(listener: (realDay: Temporal.PlainDate) => void): () => void;
	getCurrentTimestamp(): number;
}

function getMillisecondsUntilNextRealDay(): number {
	const nextRealDay = new Date();
	nextRealDay.setHours(24, 0, 0, 0);

	return Math.max(nextRealDay.getTime() - Date.now(), 0);
}

export function createTimeService(): BrowserTimeService {
	function getRealDay(): Temporal.PlainDate {
		return Temporal.Now.zonedDateTimeISO().toPlainDate();
	}

	function observeRealDay(listener: (realDay: Temporal.PlainDate) => void): () => void {
		let currentRealDay = getRealDay();
		let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
		let isCancelled = false;

		function scheduleNextRealDayNotification(): void {
			timeoutId = globalThis.setTimeout(() => {
				if (isCancelled) {
					return;
				}

				const nextRealDay = getRealDay();

				if (Temporal.PlainDate.compare(currentRealDay, nextRealDay) !== 0) {
					currentRealDay = nextRealDay;
					listener(currentRealDay);
				}

				scheduleNextRealDayNotification();
			}, getMillisecondsUntilNextRealDay());
		}

		listener(currentRealDay);
		scheduleNextRealDayNotification();

		return () => {
			isCancelled = true;

			if (timeoutId !== null) {
				globalThis.clearTimeout(timeoutId);
			}
		};
	}

	return {
		getRealDay,
		observeRealDay,
		getCurrentTimestamp: () => Date.now(),
	};
}
