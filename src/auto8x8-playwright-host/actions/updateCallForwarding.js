"use strict";
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
exports.updateCallForwarding = void 0;
var utilities_1 = require("../utilities");
////////////////////
////    MAIN    ////
////////////////////
function updateCallForwarding(browserSession, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var page, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    page = browserSession.page;
                    return [4 /*yield*/, fetchConfigPage(page)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, needsNoChanges(page, phoneNumber)];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, updateContact(page, phoneNumber)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, saveChanges(page)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, validateChanges(page, phoneNumber)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    console.error("\uD83D\uDFE1 Call forwarding update attempt failed: ".concat(e_1));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.updateCallForwarding = updateCallForwarding;
/////////////////////////////
////    LOWER ORDERED    ////
/////////////////////////////
function needsNoChanges(page, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isCorrectValue(page, phoneNumber)];
                case 1:
                    if (_a.sent()) {
                        console.log("Call Forwarding is already set to the correct contact.");
                        return [2 /*return*/, true];
                    }
                    else {
                        console.log("Updating the On-Call phone number...");
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function fetchConfigPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /* Navigates to the Call-forwarding config page for updating the On-Call contact */
                    console.log("Fetching config page...");
                    return [4 /*yield*/, page.getByText("Call forwarding rules", { exact: true }).click()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.getByRole("img", { name: "Edit" }).first().click()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getContact(page) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var EXISTING_VALUE, innerText, isPhoneExtension, match;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    EXISTING_VALUE = "[data-test-id='forwardToDestination_VALUE_CONTAINER']"
                        + " .react-select__single-value";
                    return [4 /*yield*/, page.locator(EXISTING_VALUE).innerText()];
                case 1:
                    innerText = _b.sent();
                    isPhoneExtension = innerText.includes("(");
                    if (isPhoneExtension) {
                        match = innerText.match(/.+\((?<phoneExtension>\d+)\)/);
                        return [2 /*return*/, ((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.phoneExtension) || ""];
                    }
                    return [2 /*return*/, innerText];
            }
        });
    });
}
function updateContact(page, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var PHONE_DROPDOWN, PHONE_INPUT, SUBMIT_BUTTON, newPhoneNumber, match, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Editing the phone number...");
                    PHONE_DROPDOWN = "[data-test-id='forwardToDestination_ARROW_DOWN_SOLID_ICON']";
                    PHONE_INPUT = "[data-test-id='forwardToDestination_VALUE_CONTAINER'] input";
                    SUBMIT_BUTTON = ".callForwarding-rule-edit button[data-id='SAVE']";
                    newPhoneNumber = normalizePhoneNumber(phoneNumber);
                    return [4 /*yield*/, page.locator(PHONE_DROPDOWN).click()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.fill(PHONE_INPUT, newPhoneNumber)];
                case 2:
                    _b.sent();
                    match = {
                        IS_PHONE_EXTENSION: 6,
                        IS_PHONE_NUMBER: 12,
                    };
                    _a = newPhoneNumber.length;
                    switch (_a) {
                        case match.IS_PHONE_EXTENSION: return [3 /*break*/, 3];
                        case match.IS_PHONE_NUMBER: return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, page.getByText(newPhoneNumber, { exact: true }).click()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, page.getByText("(External number)", { exact: true }).click()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, page.locator(SUBMIT_BUTTON).click()];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function saveChanges(page) {
    return __awaiter(this, void 0, void 0, function () {
        var SAVE_BUTTON, SUCCESS_CONFIRMED_BUTTON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Saving changes...");
                    SAVE_BUTTON = "[data-test-id='SAVE']";
                    SUCCESS_CONFIRMED_BUTTON = "[data-test-id='TOAST_CLOSE_ICON']";
                    return [4 /*yield*/, page.locator(SAVE_BUTTON).click()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.locator(SUCCESS_CONFIRMED_BUTTON).click()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function validateChanges(page, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.reload()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchConfigPage(page)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, isCorrectValue(page, phoneNumber)];
                case 3:
                    if (_a.sent()) {
                        console.log("Successfully updated the On-Call phone number to: ".concat((0, utilities_1.obfuscate)(phoneNumber, 4)));
                        return [2 /*return*/];
                    }
                    throw new Error("Failed to update the On-Call phone number.");
            }
        });
    });
}
///////////////////////
////    HELPERS    ////
///////////////////////
function isCorrectValue(page, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var previousPhoneNumber, _a, newPhoneNumber;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = normalizePhoneNumber;
                    return [4 /*yield*/, getContact(page)];
                case 1:
                    previousPhoneNumber = _a.apply(void 0, [_b.sent()]);
                    newPhoneNumber = normalizePhoneNumber(phoneNumber);
                    console.log("Current value: ".concat((0, utilities_1.obfuscate)(previousPhoneNumber, 4)));
                    console.log("Target value: ".concat((0, utilities_1.obfuscate)(newPhoneNumber, 4)));
                    return [2 /*return*/, newPhoneNumber === previousPhoneNumber];
            }
        });
    });
}
function normalizePhoneNumber(phoneNumber) {
    var digits = getDigits(phoneNumber);
    var match = {
        IS_PHONE_EXTENSION: 6,
        IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE: 10,
        IS_PHONE_NUMBER_WITH_COUNTRY_CODE: 11
    };
    switch (digits.length) {
        case match.IS_PHONE_EXTENSION:
            return digits;
        case match.IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE:
            return "+1".concat(digits);
        case match.IS_PHONE_NUMBER_WITH_COUNTRY_CODE:
            return "+".concat(digits);
        default:
            throw new Error("Invalid phone number provided: ".concat(phoneNumber));
    }
}
function getDigits(phoneNumber) {
    var digitsArray = phoneNumber.match(/\d/g);
    return digitsArray
        ? digitsArray.join('')
        : '';
}
