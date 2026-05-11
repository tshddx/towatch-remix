import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { truncateText } from "./table.tsx";

describe("truncateText", () => {
  it("places the ellipsis over trailing whitespace at the truncation boundary", () => {
    assert.deepEqual(truncateText("hello world", 7), { text: "hello…" });
  });

  it("keeps the truncation width when the boundary character is not whitespace", () => {
    assert.deepEqual(truncateText("hello world", 8), { text: "hello w…" });
  });
});
