import { randomPick } from "./randomPick";
import { getSampleReasonList } from "./getSampleReasonList";

export function generateRandomReason(): string {
	return randomPick(getSampleReasonList());
}
