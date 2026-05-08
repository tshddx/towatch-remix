import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { computeTableColumnWidths } from "./table-widths.ts";

describe("computeTableColumnWidths", () => {
  it("returns declared widths when there is no extra width", () => {
    assert.deepEqual(
      computeTableColumnWidths([
        { declaredWidth: 20, widestValue: 24 },
        { declaredWidth: 10, widestValue: 10 },
      ]),
      [{ computedWidth: 20 }, { computedWidth: 10 }],
    );
  });

  it("distributes extra width proportionally by declared width", () => {
    assert.deepEqual(
      computeTableColumnWidths([
        { declaredWidth: 20, widestValue: 18 },
        { declaredWidth: 10, widestValue: 7 },
      ]),
      [{ computedWidth: 21 }, { computedWidth: 9 }],
    );
  });

  it("rounds proportional allocations without changing the total width", () => {
    let columns = computeTableColumnWidths([
      { declaredWidth: 20, widestValue: 18 },
      { declaredWidth: 10, widestValue: 9 },
    ]);

    assert.deepEqual(columns, [{ computedWidth: 21 }, { computedWidth: 9 }]);
    assert.equal(
      columns.reduce((total, column) => total + column.computedWidth, 0),
      30,
    );
  });

  it("uses largest-remainder rounding when multiple columns have fractional allocations", () => {
    assert.deepEqual(
      computeTableColumnWidths([
        { declaredWidth: 5, widestValue: 4 },
        { declaredWidth: 3, widestValue: 2 },
        { declaredWidth: 2, widestValue: 1 },
      ]),
      [{ computedWidth: 6 }, { computedWidth: 2 }, { computedWidth: 2 }],
    );
  });

  it("does not let computed width exceed declared width", () => {
    assert.deepEqual(
      computeTableColumnWidths([
        { declaredWidth: 0, widestValue: 10 },
        { declaredWidth: 10, widestValue: 0 },
      ]),
      [{ computedWidth: 0 }, { computedWidth: 10 }],
    );
  });

  it("uses the widest caller-provided value even when body cells are shorter", () => {
    assert.deepEqual(
      computeTableColumnWidths([
        { declaredWidth: 12, widestValue: 10 },
        { declaredWidth: 8, widestValue: 1 },
      ]),
      [{ computedWidth: 15 }, { computedWidth: 5 }],
    );
  });
});
