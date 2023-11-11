var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var GoogleSheets = /** @class */ (function () {
    /**
     * @param sheetName - The name of the sheet to be accessed.
     * @param spreadsheetId - The ID of the spreadsheet (optional). If not provided, the
     * active spreadsheet is used.
     */
    function GoogleSheets(sheetName, spreadsheetId) {
        this.sheetName = sheetName;
        this.spreadsheetId = spreadsheetId;
        this.file = (spreadsheetId)
            ? SpreadsheetApp.openById(spreadsheetId)
            : SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = this.getSheet(sheetName);
    }
    //////////////////////
    ////    Public    ////
    //////////////////////
    /**
     * Retrieves key-value pairs from the specified columns in the sheet.
     *
     * @param keysHeader - The header text of the column to be used as keys.
     * @param valuesHeader - The header text of the column to be used as values.
     * @returns A record object with keys mapped to their corresponding values.
     * @throws Will throw an error if no matching key/value pairs are found.
     */
    GoogleSheets.prototype.get = function (keysHeader, valuesHeader) {
        var _this = this;
        var keys = this.getColumnValues(keysHeader);
        var values = this.getColumnValues(valuesHeader);
        // Ensure that the keys array dictates the structure of the object
        var keyValuePairs = keys.reduce(function (acc, key, index) {
            var _a;
            return __assign(__assign({}, acc), (_a = {}, _a[key] = values[index] !== "" ? _this.parse(values[index]) : undefined, _a));
        }, {});
        if (!keys.length) {
            throw new Error("[GoogleSheets] \uD83D\uDD34 No matching key/value pairs found in sheet: ".concat(this.sheetName));
        }
        console.log("[GoogleSheets] Returned '".concat(this.sheetName, "' records as an object."));
        return keyValuePairs;
    };
    GoogleSheets.prototype.getAs = function (Class, keysHeader, valuesHeader) {
        var _this = this;
        var keys = this.getColumnValues(keysHeader);
        var values = this.getColumnValues(valuesHeader);
        var keyValuePairs = keys.reduce(function (acc, key, index) {
            var _a;
            return __assign(__assign({}, acc), (_a = {}, _a[key] = _this.parse(values[index]), _a));
        }, {});
        var objects = Object.keys(keyValuePairs).map(function (key) { return new Class(key, keyValuePairs[key]); });
        if (objects.length) {
            console.log("[GoogleSheets] Returned '".concat(this.sheetName, "' records as an array of ") +
                "'".concat(Class.name, "' objects."));
            return objects;
        }
        throw new Error("[GoogleSheets] \uD83D\uDD34 No matching key/value pairs found in sheet: ".concat(this.sheetName));
    };
    /////////////////////////
    ////    Protected    ////
    /////////////////////////
    GoogleSheets.prototype.getSheet = function (sheetName) {
        var sheet = this.file.getSheetByName(sheetName);
        if (sheet) {
            return sheet;
        }
        throw new Error("[GoogleSheets] \uD83D\uDD34 Sheet not found: ".concat(sheetName));
    };
    GoogleSheets.prototype.getColumnValues = function (columnName) {
        var allCellValues = this.sheet
            .getRange(1, 1, this.sheet.getLastRow(), this.sheet.getLastColumn())
            .getValues();
        var _a = this.findColumnIndices(columnName, allCellValues), rowIndex = _a.rowIndex, colIndex = _a.colIndex;
        var columnValues = allCellValues
            .slice(rowIndex + 1)
            .map(function (row) { var _a; return ((_a = row[colIndex]) === null || _a === void 0 ? void 0 : _a.toString().trim()) || ""; });
        var lastNonEmptyRowIndex = columnValues
            .map(function (value, index) { return value !== "" ? index : -1; })
            .reverse()
            .find(function (index) { return index !== -1; });
        return (lastNonEmptyRowIndex !== undefined)
            ? columnValues.slice(0, lastNonEmptyRowIndex + 1)
            : [];
    };
    GoogleSheets.prototype.findColumnIndices = function (columnName, allCellValues) {
        return allCellValues.reduce(function (acc, row, rowIndex) {
            var colIndex = row.findIndex(function (cell) { return cell === columnName; });
            return colIndex !== -1
                ? { rowIndex: rowIndex, colIndex: colIndex }
                : acc;
        }, { rowIndex: -1, colIndex: -1 });
    };
    GoogleSheets.prototype.parse = function (value) {
        try {
            return value ? JSON.parse(value) : undefined;
        }
        catch (_a) {
            return value;
        }
    };
    return GoogleSheets;
}());
