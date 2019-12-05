import React, { Props, FunctionComponentFactory } from "react";
export interface VirtualizedComponentProps extends Props<any> {
    column: number;
    row: number;
    key: number;
}
export declare type VirtualizedComponent = FunctionComponentFactory<VirtualizedComponentProps>;
export interface VirtualizeProps extends Props<any> {
    rows: number;
    columns: number;
    avgWidth: number;
    avgHeight: number;
    row: VirtualizedComponent;
    column: VirtualizedComponent;
    onScroll?: (scrollTop: number, height: number, scrollLeft: number, width: number) => void;
    style?: React.CSSProperties;
    className?: string;
}
export declare function Virtualize(props: VirtualizeProps): JSX.Element;
