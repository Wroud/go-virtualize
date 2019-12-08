import { Props, memo } from "react";
import { VirtualizedComponent } from "./Virtualize";
import React from "react";
import { Columns } from "Columns";

export interface BoxProps extends Props<any> {
  realRows: number;
  rowsOffset: number;
  isScrolling: boolean;
  row: VirtualizedComponent;
}

export const Rows = memo(
  function Rows({ realRows, rowsOffset, row: Row, isScrolling }: BoxProps) {
    const rowsList = new Array<JSX.Element>(realRows);
    for (let row = 0; row < realRows; row++) {
      const offset = row + rowsOffset;
      rowsList[row] = (
        <Row row={offset} column={0} key={offset} isScrolling={isScrolling}>
          <Columns row={offset} />
        </Row>
      );
    }
    return <>{rowsList}</>;
  },
  (prev, next) =>
    prev.realRows === next.realRows &&
    prev.rowsOffset === next.rowsOffset &&
    prev.row === next.row &&
    prev.isScrolling === next.isScrolling
);
