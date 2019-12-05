import { Props } from "react";
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
export declare const Box: import("react").NamedExoticComponent<BoxProps>;
