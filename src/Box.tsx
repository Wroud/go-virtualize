import { Props, memo } from "react";
import { VirtualizedComponent } from "./Virtualize";

export interface BoxProps extends Props<any> {
  maxColumns: number;
  maxRows: number;
  rows: number;
  columns: number;
  rowsOffset: number;
  columnsOffset: number;
  row: VirtualizedComponent;
  column: VirtualizedComponent;
}

function renderColumns(
  columnComponent: VirtualizedComponent,
  realColumns: number,
  columnsOffset: number,
  row: number
) {
  const columnsList: any = new Array(realColumns);
  for (let column = 0; column < realColumns; column++) {
    columnsList.push(
      columnComponent({ row, column: column + columnsOffset, key: column })
    );
  }
  return columnsList;
}

export const Box = memo(
  function Box({
    maxColumns,
    maxRows,
    rows,
    columns,
    rowsOffset,
    columnsOffset,
    column: columnComponent,
    row: rowComponent
  }: BoxProps) {
    const realColumns = Math.min(maxColumns - columnsOffset, columns);
    const realRows = Math.min(maxRows - rowsOffset, rows);

    const rowsList: any = new Array(realRows);
    for (let row = 0; row < realRows; row++) {
      rowsList.push(
        rowComponent({
          row: row + rowsOffset,
          column: 0,
          key: row,
          children: renderColumns(
            columnComponent,
            realColumns,
            columnsOffset,
            row + rowsOffset
          )
        })
      );
    }
    return rowsList;
  },
  (prev, next) =>
    prev.maxRows === next.maxRows &&
    prev.rows === next.rows &&
    prev.columns === next.columns &&
    prev.maxColumns === next.maxColumns &&
    prev.rowsOffset === next.rowsOffset &&
    prev.columnsOffset === next.columnsOffset
);
