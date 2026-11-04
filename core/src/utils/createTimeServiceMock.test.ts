import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { createTimeServiceMock } from "./createTimeServiceMock";

function setNow(currentInstant: string, timeZone: string): () => void {
	const nowInstant = Temporal.Now.instant;
	const nowTimeZoneId = Temporal.Now.timeZoneId;

	Temporal.Now.instant = (): Temporal.Instant => Temporal.Instant.from(currentInstant);
	Temporal.Now.timeZoneId = (): string => timeZone;

	return (): void => {
		Temporal.Now.instant = nowInstant;
		Temporal.Now.timeZoneId = nowTimeZoneId;
	};
}

describe("createTimeServiceMock", () => {
	it("should return the current real day", () => {
		const restoreNow = setNow("2024-01-15T10:30:00Z", "UTC");

		try {
			const { timeService } = createTimeServiceMock();

			expect(timeService.getRealDay().toString()).toBe("2024-01-15");
		} finally {
			restoreNow();
		}
	});

	it("should notify listeners when the real day changes", () => {
		const restoreNow = setNow("2024-12-31T23:59:00Z", "UTC");

		try {
			const observedDays: string[] = [];
			const { advanceTimeMS, timeService } = createTimeServiceMock();
			const unsubscribe = timeService.observeRealDay((realDay) => {
				observedDays.push(realDay.toString());
			});

			advanceTimeMS(60_000);
			unsubscribe();

			expect(observedDays).toEqual(["2024-12-31", "2025-01-01"]);
		} finally {
			restoreNow();
		}
	});

	it("should stop notifying listeners after unsubscribe", () => {
		const restoreNow = setNow("2024-01-15T23:59:00Z", "UTC");

		try {
			const observedDays: string[] = [];
			const { advanceTimeMS, timeService } = createTimeServiceMock();
			const unsubscribe = timeService.observeRealDay((realDay) => {
				observedDays.push(realDay.toString());
			});

			unsubscribe();
			advanceTimeMS(60_000);

			expect(observedDays).toEqual(["2024-01-15"]);
		} finally {
			restoreNow();
		}
	});

	it("should allow advancing zero milliseconds", () => {
		const restoreNow = setNow("2024-01-15T10:30:00Z", "UTC");

		try {
			const observedDays: string[] = [];
			const { advanceTimeMS, timeService } = createTimeServiceMock();

			timeService.observeRealDay((realDay) => {
				observedDays.push(realDay.toString());
			});

			expect(() => {
				advanceTimeMS(0);
			}).not.toThrow();
			expect(observedDays).toEqual(["2024-01-15"]);
		} finally {
			restoreNow();
		}
	});

	it("should throw when advancing a negative duration", () => {
		const restoreNow = setNow("2024-01-15T10:30:00Z", "UTC");

		try {
			const { advanceTimeMS } = createTimeServiceMock();

			expect(() => {
				advanceTimeMS(-1);
			}).toThrow("advanceTimeMS only supports non-negative values.");
		} finally {
			restoreNow();
		}
	});
});
