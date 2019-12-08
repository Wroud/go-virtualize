"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const Virtualize_1 = require("Virtualize");
exports.Columns = react_1.memo(function Columns({ row }) {
    const { realColumns, column: Column, columnsOffset, isScrolling } = react_1.useContext(Virtualize_1.ColumnsContext);
    const columnsList = new Array(realColumns);
    for (let column = 0; column < realColumns; column++) {
        const offset = column + columnsOffset;
        columnsList[column] = (react_2.default.createElement(Column, { row: row, column: offset, key: offset, isScrolling: isScrolling }));
    }
    return react_2.default.createElement(react_2.default.Fragment, null, columnsList);
}, (prev, next) => prev.row === next.row);
//# sourceMappingURL=Columns.js.map