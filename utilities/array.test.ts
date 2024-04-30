import { describe, expect, it } from "bun:test";

import { chunk } from "./array";


describe("chunk", () => {
    it("should split an array into chunks of the given size", () => {
        const input = [1, 2, 3, 4, 5, 6, 7];
        const result = chunk(input, 3);
        expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    })
})