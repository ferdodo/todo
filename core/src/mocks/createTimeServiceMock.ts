import type { TimeService } from "../services/TimeService";
import { Temporal } from "temporal-polyfill";

export function createTimeServiceMock(): TimeService {
	const currentTimestamp = Temporal.Now.instant().epochMilliseconds;

	return {
		getRealDay: () => Temporal.PlainDate.from("2024-01-01"),
		observeRealDay: () => () => {},
		getCurrentTimestamp: () => currentTimestamp,
	};
}
