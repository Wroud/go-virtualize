"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Rows_1 = require("./Rows");
exports.ColumnsContext = react_1.createContext({
    column: null,
    realColumns: 0,
    columnsOffset: 0,
    isScrolling: false
});
function patchStyle(style, isScrollable) {
    return Object.assign(Object.assign({}, (style || {})), { position: "relative", overflow: isScrollable ? "auto" : "visible" });
}
function boxStyle(offsetLeft, offsetTop, isScrollable) {
    return {
        position: "sticky",
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
function getFakeStyle(width, height) {
    return {
        width: `${width}px`,
        height: `${height}px`
    };
}
function Virtualize(props) {
    const { className, rows: maxRows, columns: maxColumns, row, column, onScroll, avgHeight, avgWidth, style } = props;
    const boxRef = react_1.useRef(null);
    const viewportRef = react_1.useRef(null);
    const fakeBoxRef = react_1.useRef(null);
    const [columns, setColumns] = react_1.useState(0);
    const [rows, setRows] = react_1.useState(0);
    const [isScrolling, setScrolling] = react_1.useState(false);
    const scheduledAnimationFrame = react_1.useRef(0);
    const animationTask = react_1.useRef(0);
    const scrollingTask = react_1.useRef(0);
    const [scrollPosition, setScrollPosition] = react_1.useState([0, 0]);
    const handleScroll = react_1.useCallback(() => {
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
            onScroll(viewportRef.current.scrollTop, fakeBoxRef.current.offsetHeight, viewportRef.current.scrollLeft, fakeBoxRef.current.offsetWidth);
        }
        scheduledAnimationFrame.current = 0;
    }, [viewportRef, fakeBoxRef, setScrollPosition, onScroll]);
    react_1.useEffect(() => {
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
            animationTask.current = setTimeout(() => requestAnimationFrame(handleScroll), 5);
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
    const [realColumns, realRows] = react_1.useMemo(() => [
        Math.min(Math.ceil(viewportWidth / avgWidth) + 1, maxColumns),
        Math.min(Math.ceil(viewportHeight / avgHeight) + 1, maxRows)
    ], [viewportWidth, viewportHeight, maxColumns, avgWidth, maxRows, avgHeight]);
    react_1.useLayoutEffect(() => {
        if (columns !== realColumns) {
            setColumns(realColumns);
        }
        if (realRows !== rows) {
            setRows(realRows);
        }
    }, [realColumns, columns, rows, realRows, setRows, setColumns]);
    const [offsetWidth, offsetHeight, offsetLeft, offsetTop] = react_1.useMemo(() => [
        Math.floor(scrollPosition[0] / avgWidth),
        Math.floor(scrollPosition[1] / avgHeight),
        0,
        0 //-(scrollPosition[1] % avgHeight)
    ], [scrollPosition[0], scrollPosition[1], avgWidth, avgHeight]);
    const patchedStyle = react_1.useMemo(() => patchStyle(style, true), [style]);
    const boxStyles = react_1.useMemo(() => boxStyle(offsetLeft, offsetTop), [
        offsetLeft,
        offsetTop
    ]);
    const fakeStyle = react_1.useMemo(() => getFakeStyle(Math.max(avgWidth * maxColumns - boxWidth, 1), Math.max(avgHeight * maxRows - boxHeight, 1)), [avgWidth, maxColumns, boxWidth, boxHeight, avgHeight, maxRows]);
    const columnsState = react_1.useMemo(() => ({ realColumns, columnsOffset: offsetWidth, column, isScrolling }), [realColumns, offsetWidth, column, isScrolling]);
    return (react_1.default.createElement("div", { className: className, style: patchedStyle, ref: viewportRef },
        react_1.default.createElement("div", { ref: boxRef, style: boxStyles },
            react_1.default.createElement(exports.ColumnsContext.Provider, { value: columnsState },
                react_1.default.createElement(Rows_1.Rows, { realRows: realRows, rowsOffset: offsetHeight, row: row, isScrolling: isScrolling }))),
        react_1.default.createElement("div", { ref: fakeBoxRef, style: fakeStyle })));
}
exports.Virtualize = Virtualize;
//# sourceMappingURL=Virtualize.js.map