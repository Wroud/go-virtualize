"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function renderColumns(columnComponent, realColumns, columnsOffset, row) {
    const columnsList = new Array(realColumns);
    for (let column = 0; column < realColumns; column++) {
        columnsList.push(columnComponent({ row, column: column + columnsOffset, key: column }));
    }
    return columnsList;
}
exports.Box = react_1.memo(function Box({ maxColumns, maxRows, rows, columns, rowsOffset, columnsOffset, column: columnComponent, row: rowComponent }) {
    const realColumns = Math.min(maxColumns - columnsOffset, columns);
    const realRows = Math.min(maxRows - rowsOffset, rows);
    const rowsList = new Array(realRows);
    for (let row = 0; row < realRows; row++) {
        rowsList.push(rowComponent({
            row: row + rowsOffset,
            column: 0,
            key: row,
            children: renderColumns(columnComponent, realColumns, columnsOffset, row + rowsOffset)
        }));
    }
    return rowsList;
}, (prev, next) => prev.maxRows === next.maxRows &&
    prev.rows === next.rows &&
    prev.columns === next.columns &&
    prev.maxColumns === next.maxColumns &&
    prev.rowsOffset === next.rowsOffset &&
    prev.columnsOffset === next.columnsOffset);
//# sourceMappingURL=Box.js.map