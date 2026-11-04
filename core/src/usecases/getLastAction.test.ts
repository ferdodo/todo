import { describe, it, expect } from "vitest";
import { getLastAction } from "./getLastAction";
import { createMockTodoContext } from "../mocks/createMockTodoContext";

describe("getLastAction", () => {
	it("should return null when no action exists", () => {
		const context = createMockTodoContext();

		const result = getLastAction(context);

		expect(result).toBeNull();
	});

});
