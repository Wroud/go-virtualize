import { memo, Props, useContext } from "react";
import React from "react";
import { ColumnsContext } from "Virtualize";

export interface ColumnsProps extends Props<any> {
  row: number;
}

export const Columns = memo(
  function Columns({ row }: ColumnsProps) {
    const {
      realColumns,
      column: Column,
      columnsOffset,
      isScrolling
    } = useContext(ColumnsContext);
    const columnsList = new Array<JSX.Element>(realColumns);
    for (let column = 0; column < realColumns; column++) {
      const offset = column + columnsOffset;
      columnsList[column] = (
        <Column
          row={row}
          column={offset}
          key={offset}
          isScrolling={isScrolling}
        />
      );
    }
    return <>{columnsList}</>;
  },
  (prev, next) => prev.row === next.row
);
