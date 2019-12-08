import React, {
  Props,
  useEffect,
  useRef,
  useState,
  useCallback,
  FunctionComponentFactory,
  useMemo,
  useLayoutEffect,
  createContext
} from "react";
import { Rows } from "./Rows";

export interface VirtualizedComponentProps extends Props<any> {
  column: number;
  row: number;
  isScrolling: boolean;
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

export interface ColumnsState {
  column: VirtualizedComponent;
  realColumns: number;
  columnsOffset: number;
  isScrolling: boolean;
}

export const ColumnsContext = createContext<ColumnsState>({
  column: null as any,
  realColumns: 0,
  columnsOffset: 0,
  isScrolling: false
});

function patchStyle(style?: any, isScrollable?: boolean) {
  return {
    ...(style || {}),
    position: "relative" as "relative",
    overflow: isScrollable ? "auto" : "visible"
  };
}

function boxStyle(
  offsetLeft: number,
  offsetTop: number,
  isScrollable?: boolean
) {
  return {
    position: "sticky" as "sticky",
    willChange: "transform",
    left: `${offsetLeft}px`,
    top: `${offsetTop}px`,
    // left: "0",
    // top: "0",
    overflow: isScrollable ? "auto" : "visible"
    // height: "100%",
    // width: "100%"
  };
}

function getFakeStyle(width: number, height: number) {
  return {
    width: `${width}px`,
    height: `${height}px`
  };
}

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
  const [isScrolling, setScrolling] = useState(false);
  const scheduledAnimationFrame = useRef(0);
  const animationTask = useRef(0);
  const scrollingTask = useRef(0);
  const [scrollPosition, setScrollPosition] = useState([0, 0]);

  const handleScroll = useCallback(() => {
    if (!viewportRef.current) {
      return;
    }

    setScrollPosition([
      viewportRef.current.scrollLeft,
      viewportRef.current.scrollTop
    ]);
    setScrolling(true);
    clearTimeout(scrollingTask.current);
    scrollingTask.current = setTimeout(() => setScrolling(false), 50);

    if (onScroll && fakeBoxRef.current) {
      onScroll(
        viewportRef.current.scrollTop,
        fakeBoxRef.current.offsetHeight,
        viewportRef.current.scrollLeft,
        fakeBoxRef.current.offsetWidth
      );
    }
    scheduledAnimationFrame.current = 0;
  }, [viewportRef, fakeBoxRef, setScrollPosition, onScroll]);

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }
    const copy = viewportRef.current;

    function onScroll() {
      scheduledAnimationFrame.current++;
      if (scheduledAnimationFrame.current >= 10) {
        clearTimeout(animationTask.current);
        requestAnimationFrame(handleScroll);
        return;
      }
      clearTimeout(animationTask.current);
      animationTask.current = setTimeout(
        () => requestAnimationFrame(handleScroll),
        5
      );
      // requestAnimationFrame(handleScroll);
      //window.requestIdleCallback
    }

    copy.addEventListener("scroll", onScroll);

    return () => copy.removeEventListener("scroll", onScroll);
  }, [viewportRef, handleScroll]);

  const [viewportWidth, viewportHeight] = viewportRef.current
    ? [viewportRef.current.offsetWidth, viewportRef.current.offsetHeight]
    : [0, 0];

  const [boxWidth, boxHeight] = boxRef.current
    ? [boxRef.current.offsetWidth, boxRef.current.offsetHeight]
    : [0, 0];

  // const [boxScrollWidth, boxScrollHeight] = boxRef.current
  //   ? [boxRef.current.scrollWidth, boxRef.current.scrollHeight]
  //   : [0, 0];

  const [realColumns, realRows] = useMemo(
    () => [
      Math.min(Math.ceil(viewportWidth / avgWidth) + 1, maxColumns),
      Math.min(Math.ceil(viewportHeight / avgHeight) + 1, maxRows)
    ],
    [viewportWidth, viewportHeight, maxColumns, avgWidth, maxRows, avgHeight]
  );

  useLayoutEffect(() => {
    if (columns !== realColumns) {
      setColumns(realColumns);
    }

    if (realRows !== rows) {
      setRows(realRows);
    }
  }, [realColumns, columns, rows, realRows, setRows, setColumns]);

  const [offsetWidth, offsetHeight, offsetLeft, offsetTop] = useMemo(
    () => [
      Math.floor(scrollPosition[0] / avgWidth),
      Math.floor(scrollPosition[1] / avgHeight),
      0, //-(scrollPosition[0] % avgWidth),
      0 //-(scrollPosition[1] % avgHeight)
    ],
    [scrollPosition[0], scrollPosition[1], avgWidth, avgHeight]
  );

  const patchedStyle = useMemo(() => patchStyle(style, true), [style]);

  const boxStyles = useMemo(() => boxStyle(offsetLeft, offsetTop), [
    offsetLeft,
    offsetTop
  ]);

  const fakeStyle = useMemo(
    () =>
      getFakeStyle(
        Math.max(avgWidth * maxColumns - boxWidth, 1),
        Math.max(avgHeight * maxRows - boxHeight, 1)
      ),
    [avgWidth, maxColumns, boxWidth, boxHeight, avgHeight, maxRows]
  );

  const columnsState = useMemo(
    () => ({ realColumns, columnsOffset: offsetWidth, column, isScrolling }),
    [realColumns, offsetWidth, column, isScrolling]
  );

  return (
    <div className={className} style={patchedStyle} ref={viewportRef}>
      <div ref={boxRef} style={boxStyles}>
        <ColumnsContext.Provider value={columnsState}>
          <Rows
            realRows={realRows}
            rowsOffset={offsetHeight}
            row={row}
            isScrolling={isScrolling}
          />
        </ColumnsContext.Provider>
      </div>
      <div ref={fakeBoxRef} style={fakeStyle} />
    </div>
  );
}
