import { describe, it, expect } from "vitest";
import { getNextAction } from "./getNextAction";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("getNextAction", () => {
	it("should return null when no action exists", () => {
		const context = createMockTodoContext();

		const result = getNextAction(context);

		expect(result).toBeNull();
	});

});
