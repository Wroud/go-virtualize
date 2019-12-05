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
const Box_1 = require("./Box");
const hidingBox = {
    position: "absolute",
    left: `0`,
    top: `0`,
    width: "0",
    height: "0",
    overflow: "visible"
};
function Virtualize(props) {
    const { className, rows: maxRows, columns: maxColumns, row, column, onScroll, avgHeight, avgWidth, style } = props;
    const boxRef = react_1.useRef(null);
    const viewportRef = react_1.useRef(null);
    const fakeBoxRef = react_1.useRef(null);
    const [columns, setColumns] = react_1.useState(0);
    const [rows, setRows] = react_1.useState(0);
    const size = react_1.useRef([0, 0]);
    const viewport = react_1.useRef([0, 0]);
    const [scrollPosition, setScrollPosition] = react_1.useState([0, 0]);
    const handleScroll = react_1.useCallback(() => {
        if (!viewportRef.current) {
            return;
        }
        setScrollPosition([
            viewportRef.current.scrollLeft,
            viewportRef.current.scrollTop
        ]);
        if (onScroll && fakeBoxRef.current) {
            onScroll(viewportRef.current.scrollTop, fakeBoxRef.current.offsetHeight, viewportRef.current.scrollLeft, fakeBoxRef.current.offsetWidth);
        }
    }, [viewportRef, fakeBoxRef, setScrollPosition, onScroll]);
    react_1.useEffect(() => {
        if (!viewportRef.current) {
            return;
        }
        const copy = viewportRef.current;
        copy.addEventListener("scroll", handleScroll);
        return () => copy.removeEventListener("scroll", handleScroll);
    }, [viewportRef, handleScroll]);
    react_1.useLayoutEffect(() => {
        if (!boxRef.current || !viewportRef.current) {
            return;
        }
        const newBoxWidth = boxRef.current.offsetWidth;
        const newBoxHeight = boxRef.current.offsetHeight;
        const newViewportWidth = viewportRef.current.offsetWidth;
        const newViewportHeight = viewportRef.current.offsetHeight;
        if (newBoxWidth === size.current[0] &&
            newBoxHeight === size.current[1] &&
            newViewportWidth === viewport.current[0] &&
            newViewportHeight === viewport.current[1]) {
            return;
        }
        size.current[0] = newBoxWidth;
        size.current[1] = newBoxHeight;
        viewport.current[0] = newViewportWidth;
        viewport.current[1] = newViewportHeight;
        if (newBoxWidth < newViewportWidth && columns < maxColumns) {
            setColumns(columns + 1);
        }
        else if (newBoxWidth - avgWidth * 2 >= newViewportWidth && columns > 0) {
            setColumns(columns - 1);
        }
        if (newBoxHeight < newViewportHeight && rows < maxRows) {
            setRows(rows + 1);
        }
        else if (newBoxHeight - avgHeight * 2 >= newViewportHeight && rows > 0) {
            setRows(rows - 1);
        }
    });
    const offsetWidth = Math.floor(scrollPosition[0] / avgWidth);
    const offsetHeight = Math.floor(scrollPosition[1] / avgHeight);
    let patchedStyle = react_1.useMemo(() => (Object.assign(Object.assign({}, (style || {})), { position: "relative", overflow: "auto" })), [style]);
    let boxStyle = react_1.useMemo(() => {
        const positionLeft = scrollPosition[0] % avgWidth;
        const positionRight = scrollPosition[1] % avgHeight;
        return {
            position: "absolute",
            willChange: "transform",
            left: `${scrollPosition[0] - positionLeft}px`,
            top: `${scrollPosition[1] - positionRight}px`
        };
    }, [scrollPosition[0], scrollPosition[1], avgWidth, avgHeight]);
    let fakeStyle = react_1.useMemo(() => ({
        width: `${avgWidth * maxColumns}px`,
        height: `${avgHeight * maxRows}px`
    }), [avgWidth, maxColumns, avgHeight, maxRows]);
    return (react_1.default.createElement("div", { className: className, style: patchedStyle, ref: viewportRef },
        react_1.default.createElement("div", { ref: fakeBoxRef, style: fakeStyle }),
        react_1.default.createElement("div", { style: hidingBox },
            react_1.default.createElement("div", { ref: boxRef, style: boxStyle },
                react_1.default.createElement(Box_1.Box, { maxColumns: maxColumns, maxRows: maxRows, rows: rows, columns: columns, rowsOffset: offsetHeight, columnsOffset: offsetWidth, row: row, column: column })))));
}
exports.Virtualize = Virtualize;
//# sourceMappingURL=Virtualize.js.map