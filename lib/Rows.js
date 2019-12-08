"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const Columns_1 = require("Columns");
exports.Rows = react_1.memo(function Rows({ realRows, rowsOffset, row: Row, isScrolling }) {
    const rowsList = new Array(realRows);
    for (let row = 0; row < realRows; row++) {
        const offset = row + rowsOffset;
        rowsList[row] = (react_2.default.createElement(Row, { row: offset, column: 0, key: offset, isScrolling: isScrolling },
            react_2.default.createElement(Columns_1.Columns, { row: offset })));
    }
    return react_2.default.createElement(react_2.default.Fragment, null, rowsList);
}, (prev, next) => prev.realRows === next.realRows &&
    prev.rowsOffset === next.rowsOffset &&
    prev.row === next.row &&
    prev.isScrolling === next.isScrolling);
//# sourceMappingURL=Rows.js.map