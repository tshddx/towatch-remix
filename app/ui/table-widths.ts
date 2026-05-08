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
    (total, column, index) => total + column.declaredWidth - contentWidths[index],
    0,
  );

  if (extraWidth <= 0) {
    return columns.map((column) => ({ computedWidth: column.declaredWidth }));
  }

  let distributedWidths = distributeWidth(
    extraWidth,
    columns.map((column) => column.declaredWidth),
  );

  return contentWidths.map((width, index) => ({
    computedWidth: width + distributedWidths[index],
  }));
}

function distributeWidth(extraWidth: number, weights: number[]): number[] {
  let totalWeight = weights.reduce((total, weight) => total + weight, 0);
  if (totalWeight <= 0) return weights.map(() => 0);

  let allocations = weights.map((weight, index) => {
    let raw = (extraWidth * weight) / totalWeight;
    return { index, width: Math.floor(raw), remainder: raw % 1 };
  });

  let allocated = allocations.reduce(
    (total, allocation) => total + allocation.width,
    0,
  );

  for (let allocation of allocations
    .slice()
    .sort(
      (a, b) => b.remainder - a.remainder || weights[b.index] - weights[a.index],
    )) {
    if (allocated >= extraWidth) break;
    allocation.width++;
    allocated++;
  }

  return allocations
    .sort((a, b) => a.index - b.index)
    .map((allocation) => allocation.width);
}
