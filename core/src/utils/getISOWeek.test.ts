import { describe, it, expect } from "vitest";
import { getISOWeek } from "./getISOWeek";

describe("getISOWeek", () => {
it("should return week 1 for 2024-01-01", () => {
const result = getISOWeek("2024-01-01");
expect(result.week).toBe(1);
expect(result.year).toBe(2024);
});

it("should return week 52 for late December dates", () => {
const result = getISOWeek("2024-12-25");
expect(result.week).toBe(52);
expect(result.year).toBe(2024);
});
});
