import { Props } from "react";
import { VirtualizedComponent } from "./Virtualize";
import React from "react";
export interface BoxProps extends Props<any> {
    realRows: number;
    rowsOffset: number;
    isScrolling: boolean;
    row: VirtualizedComponent;
}
export declare const Rows: React.NamedExoticComponent<BoxProps>;
