"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserSession = exports.BrowserSession = void 0;
// src/browser/BrowserSession.ts
var playwright_1 = require("playwright");
var BrowserSession = /** @class */ (function () {
    function BrowserSession(headless) {
        if (headless === void 0) { headless = false; }
        this.headless = headless;
        this.browser = null;
        this.context = null;
        this.page = null;
    }
    BrowserSession.prototype.initialize = function (launchOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, playwright_1.chromium.launch(__assign({ headless: this.headless }, launchOptions))];
                    case 1:
                        _a.browser = _d.sent();
                        assertNonNull(this.browser, 'browser');
                        _b = this;
                        return [4 /*yield*/, this.browser.newContext()];
                    case 2:
                        _b.context = _d.sent();
                        assertNonNull(this.context, 'context');
                        _c = this;
                        return [4 /*yield*/, this.context.newPage()];
                    case 3:
                        _c.page = _d.sent();
                        assertNonNull(this.page, 'page');
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserSession.get = function (headless, launchOptions) {
        if (headless === void 0) { headless = false; }
        if (launchOptions === void 0) { launchOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = new BrowserSession(headless);
                        return [4 /*yield*/, session.initialize(launchOptions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, session];
                }
            });
        });
    };
    BrowserSession.prototype.close = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled([
                            (_a = this.page) === null || _a === void 0 ? void 0 : _a.close(),
                            (_b = this.context) === null || _b === void 0 ? void 0 : _b.close(),
                            (_c = this.browser) === null || _c === void 0 ? void 0 : _c.close()
                        ])];
                    case 1:
                        _d.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return BrowserSession;
}());
exports.BrowserSession = BrowserSession;
/////////////////////////////////
////    CONVINIENCE FUNCS    ////
/////////////////////////////////
function getBrowserSession(headless, launchOptions) {
    if (headless === void 0) { headless = false; }
    if (launchOptions === void 0) { launchOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var browserSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, BrowserSession.get(headless, launchOptions)];
                case 1:
                    browserSession = _a.sent();
                    return [2 /*return*/, browserSession];
            }
        });
    });
}
exports.getBrowserSession = getBrowserSession;
/////////////////////////////////
////    LOWER ORDER FUNCS    ////
/////////////////////////////////
function assertNonNull(value, name) {
    if (value === null) {
        throw new Error("Initialization failed: ".concat(name, " is null"));
    }
}
;
