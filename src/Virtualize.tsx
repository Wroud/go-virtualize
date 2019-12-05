import React, {
  Props,
  useEffect,
  useRef,
  useState,
  useCallback,
  FunctionComponentFactory,
  useMemo,
  useLayoutEffect
} from "react";
import { Box } from "./Box";

export interface VirtualizedComponentProps extends Props<any> {
  column: number;
  row: number;
  key: number;
}

export type VirtualizedComponent = FunctionComponentFactory<
  VirtualizedComponentProps
>;

export interface VirtualizeProps extends Props<any> {
  rows: number;
  columns: number;
  avgWidth: number;
  avgHeight: number;
  row: VirtualizedComponent;
  column: VirtualizedComponent;
  onScroll?: (
    scrollTop: number,
    height: number,
    scrollLeft: number,
    width: number
  ) => void;
  style?: React.CSSProperties;
  className?: string;
}

const hidingBox = {
  position: "absolute" as "absolute",
  left: `0`,
  top: `0`,
  width: "0",
  height: "0",
  overflow: "visible"
};

export function Virtualize(props: VirtualizeProps) {
  const {
    className,
    rows: maxRows,
    columns: maxColumns,
    row,
    column,
    onScroll,
    avgHeight,
    avgWidth,
    style
  } = props;
  const boxRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const fakeBoxRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const size = useRef([0, 0]);
  const viewport = useRef([0, 0]);
  const [scrollPosition, setScrollPosition] = useState([0, 0]);

  const handleScroll = useCallback(() => {
    if (!viewportRef.current) {
      return;
    }

    setScrollPosition([
      viewportRef.current.scrollLeft,
      viewportRef.current.scrollTop
    ]);

    if (onScroll && fakeBoxRef.current) {
      onScroll(
        viewportRef.current.scrollTop,
        fakeBoxRef.current.offsetHeight,
        viewportRef.current.scrollLeft,
        fakeBoxRef.current.offsetWidth
      );
    }
  }, [viewportRef, fakeBoxRef, setScrollPosition, onScroll]);

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }
    const copy = viewportRef.current;
    copy.addEventListener("scroll", handleScroll);

    return () => copy.removeEventListener("scroll", handleScroll);
  }, [viewportRef, handleScroll]);

  useLayoutEffect(() => {
    if (!boxRef.current || !viewportRef.current) {
      return;
    }

    const newBoxWidth = boxRef.current.offsetWidth;
    const newBoxHeight = boxRef.current.offsetHeight;
    const newViewportWidth = viewportRef.current.offsetWidth;
    const newViewportHeight = viewportRef.current.offsetHeight;

    if (
      newBoxWidth === size.current[0] &&
      newBoxHeight === size.current[1] &&
      newViewportWidth === viewport.current[0] &&
      newViewportHeight === viewport.current[1]
    ) {
      return;
    }

    size.current[0] = newBoxWidth;
    size.current[1] = newBoxHeight;
    viewport.current[0] = newViewportWidth;
    viewport.current[1] = newViewportHeight;

    if (newBoxWidth < newViewportWidth && columns < maxColumns) {
      setColumns(columns + 1);
    } else if (newBoxWidth - avgWidth * 2 >= newViewportWidth && columns > 0) {
      setColumns(columns - 1);
    }

    if (newBoxHeight < newViewportHeight && rows < maxRows) {
      setRows(rows + 1);
    } else if (newBoxHeight - avgHeight * 2 >= newViewportHeight && rows > 0) {
      setRows(rows - 1);
    }
  });

  const offsetWidth = Math.floor(scrollPosition[0] / avgWidth);
  const offsetHeight = Math.floor(scrollPosition[1] / avgHeight);

  let patchedStyle = useMemo(
    () => ({
      ...(style || {}),
      position: "relative" as "relative",
      overflow: "auto"
    }),
    [style]
  );

  let boxStyle = useMemo(() => {
    const positionLeft = scrollPosition[0] % avgWidth;
    const positionRight = scrollPosition[1] % avgHeight;
    return {
      position: "absolute",
      willChange: "transform",
      left: `${scrollPosition[0] - positionLeft}px`,
      top: `${scrollPosition[1] - positionRight}px`
    };
  }, [scrollPosition[0], scrollPosition[1], avgWidth, avgHeight]);

  let fakeStyle = useMemo(
    () => ({
      width: `${avgWidth * maxColumns}px`,
      height: `${avgHeight * maxRows}px`
    }),
    [avgWidth, maxColumns, avgHeight, maxRows]
  );

  return (
    <div className={className} style={patchedStyle} ref={viewportRef}>
      <div ref={fakeBoxRef} style={fakeStyle} />
      <div style={hidingBox}>
        <div ref={boxRef} style={boxStyle as any}>
          <Box
            maxColumns={maxColumns}
            maxRows={maxRows}
            rows={rows}
            columns={columns}
            rowsOffset={offsetHeight}
            columnsOffset={offsetWidth}
            row={row}
            column={column}
          />
        </div>
      </div>
    </div>
  );
}
