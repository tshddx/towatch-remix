export interface TableWidthInputColumn {
  declaredWidth: number;
  widestValue: number;
}

export interface TableWidthOutputColumn {
  computedWidth: number;
}

export function computeTableColumnWidths(
  columns: TableWidthInputColumn[],
): TableWidthOutputColumn[] {
  let contentWidths = columns.map((column) =>
    Math.min(column.declaredWidth, column.widestValue),
  );

  let extraWidth = columns.reduce(
    (total, column, index) =>
      total + column.declaredWidth - contentWidths[index],
    0,
  );

  if (extraWidth <= 0) {
    return columns.map((column) => ({ computedWidth: column.declaredWidth }));
  }

  let demandWidths = columns.map((column, index) =>
    Math.max(0, column.widestValue - contentWidths[index]),
  );
  let distributedWidths = distributeWidth(
    extraWidth,
    demandWidths,
    demandWidths,
  );
  let distributedWidth = distributedWidths.reduce(
    (total, width) => total + width,
    0,
  );
  let remainingWidth = extraWidth - distributedWidth;

  if (remainingWidth > 0) {
    let fillWidths = distributeWidth(
      remainingWidth,
      columns.map((column) => column.declaredWidth),
      columns.map(() => remainingWidth),
    );
    distributedWidths = distributedWidths.map(
      (width, index) => width + fillWidths[index],
    );
  }

  return contentWidths.map((width, index) => ({
    computedWidth: width + distributedWidths[index],
  }));
}

function distributeWidth(
  width: number,
  weights: number[],
  capacities: number[],
): number[] {
  let allocations = weights.map(() => 0);
  let remainingWidth = width;

  while (remainingWidth > 0) {
    let available = weights
      .map((weight, index) => ({
        capacity: capacities[index] - allocations[index],
        index,
        weight,
      }))
      .filter((allocation) => allocation.weight > 0 && allocation.capacity > 0);
    let totalWeight = available.reduce(
      (total, allocation) => total + allocation.weight,
      0,
    );

    if (totalWeight <= 0) break;

    let shares = available.map((allocation) => {
      let raw = (remainingWidth * allocation.weight) / totalWeight;
      let width = Math.min(Math.floor(raw), allocation.capacity);
      return { ...allocation, remainder: raw % 1, width };
    });

    let allocatedThisPass = 0;
    for (let share of shares) {
      allocations[share.index] += share.width;
      allocatedThisPass += share.width;
    }

    remainingWidth -= allocatedThisPass;

    for (let share of shares
      .filter((share) => allocations[share.index] < capacities[share.index])
      .sort(
        (a, b) =>
          b.remainder - a.remainder || weights[b.index] - weights[a.index],
      )) {
      if (remainingWidth <= 0) break;
      allocations[share.index]++;
      remainingWidth--;
      allocatedThisPass++;
    }

    if (allocatedThisPass === 0) break;
  }

  return allocations;
}
