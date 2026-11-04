import { Temporal } from "temporal-polyfill";
import type { TimeService } from "../services/TimeService";

interface CreateTimeServiceMockResult {
	advanceTimeMS(milliseconds: number): void;
	timeService: TimeService;
}

function getRealDayFromInstant(
	currentInstant: Temporal.Instant,
	timeZone: string,
): Temporal.PlainDate {
	return currentInstant.toZonedDateTimeISO(timeZone).toPlainDate();
}

export function createTimeServiceMock(): CreateTimeServiceMockResult {
	const listeners = new Set<(realDay: Temporal.PlainDate) => void>();
	const timeZone = Temporal.Now.timeZoneId();
	let currentInstant = Temporal.Now.instant();
	let currentRealDay = getRealDayFromInstant(currentInstant, timeZone);

	function getRealDay(): Temporal.PlainDate {
		return currentRealDay;
	}

	function advanceTimeMS(milliseconds: number): void {
		if (milliseconds < 0) {
			throw new RangeError("advanceTimeMS only supports non-negative values.");
		}

		currentInstant = Temporal.Instant.fromEpochMilliseconds(currentInstant.epochMilliseconds + milliseconds);
		const nextRealDay = getRealDayFromInstant(currentInstant, timeZone);

		while (Temporal.PlainDate.compare(currentRealDay, nextRealDay) < 0) {
			currentRealDay = currentRealDay.add({days: 1});
			listeners.forEach((listener) => {
				listener(currentRealDay);
			});
		}
	}

	function observeRealDay(listener: (realDay: Temporal.PlainDate) => void): () => void {
		listeners.add(listener);
		listener(currentRealDay);

		return () => {
			listeners.delete(listener);
		};
	}

	return {
		advanceTimeMS,
		timeService: {
			getRealDay,
			observeRealDay,
			getCurrentTimestamp: () => currentInstant.epochMilliseconds,
		},
	};
}
