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
exports.sendTextNotification = void 0;
function sendTextNotification(browserSession, phoneNumber, textMessage) {
    if (textMessage === void 0) { textMessage = "Callforwarding has been updated to your phone number."; }
    return __awaiter(this, void 0, void 0, function () {
        var page, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    page = browserSession.page;
                    return [4 /*yield*/, fetchMessagingPage(page)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, deployAutoDialogeClosers(page)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchNewMessageDialog(page)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, selectRecipient(page, phoneNumber)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sendTextMessage(page, textMessage)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    console.error("\uD83D\uDFE1 Text notification attempt failed: ".concat(e_1));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.sendTextNotification = sendTextNotification;
function fetchMessagingPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Fetching messaging page...");
                    return [4 /*yield*/, page.goto("https://work.8x8.com/conversations/messages")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchNewMessageDialog(page) {
    return __awaiter(this, void 0, void 0, function () {
        var CONTAINER, NEW_MSG_BUTTON, NEW_DRAFT_BUTTON;
        return __generator(this, function (_a) {
            console.log("Fetching new text message dialogue...");
            CONTAINER = "[data-qa='master-detail']";
            NEW_MSG_BUTTON = "".concat(CONTAINER, " [data-qa='floating-button']");
            NEW_DRAFT_BUTTON = "".concat(CONTAINER, " [data-qa='message'] button");
            page.locator(NEW_MSG_BUTTON).click({ timeout: 90000 });
            page.locator(NEW_DRAFT_BUTTON).click();
            return [2 /*return*/];
        });
    });
}
function selectRecipient(page, phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var INPUT_FIELD, TOP_RESULT;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Selecting the text message recipient...");
                    INPUT_FIELD = "input[data-qa='contact-picker-search-input']";
                    TOP_RESULT = "[data-id='MODAL_CONTENT']"
                        + " [data-qa='list.item.main']"
                        + " [data-qa='list.item.primary']";
                    return [4 /*yield*/, page.locator(INPUT_FIELD).fill(phoneNumber, { timeout: 90000 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.getByText('Search results (1)').click()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.locator(TOP_RESULT).click()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendTextMessage(page, textMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var CONTAINER, INPUT_FIELD, SEND_BUTTON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Sending the text message...");
                    CONTAINER = "[data-qa='conversation-compose']";
                    INPUT_FIELD = "".concat(CONTAINER, " div[role='textbox'] div");
                    SEND_BUTTON = "".concat(CONTAINER, " [data-qa='send-message'][data-button-disabled='false']");
                    return [4 /*yield*/, page.locator(INPUT_FIELD).fill(textMessage)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.locator(INPUT_FIELD).press('Enter')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.locator(SEND_BUTTON).click()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//////////////////////////
////    BACKGROUND    ////
//////////////////////////
function deployAutoDialogeClosers(page, timeout_ms) {
    if (timeout_ms === void 0) { timeout_ms = 10000; }
    return __awaiter(this, void 0, void 0, function () {
        var tutorialDialogInterval, noAudioInterval, voiceMailInterval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, closeTutorialDialog(page)];
                case 1:
                    tutorialDialogInterval = _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, closeNoAudioDialog(page)];
                case 3:
                    noAudioInterval = _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, closeVoiceMailDialog(page)];
                case 5:
                    voiceMailInterval = _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 6:
                    _a.sent();
                    // Stop polling after timeout is up
                    setTimeout(function () {
                        clearInterval(tutorialDialogInterval);
                        clearInterval(noAudioInterval);
                        clearInterval(voiceMailInterval);
                        console.log("Stopped polling after ".concat(timeout_ms / 1000, " seconds."));
                    }, timeout_ms); // 1 minute in milliseconds
                    return [2 /*return*/];
            }
        });
    });
}
function closeTutorialDialog(page, interval_ms) {
    if (interval_ms === void 0) { interval_ms = 1000; }
    return __awaiter(this, void 0, void 0, function () {
        var CLOSE_BUTTON, CONFIRM_BUTTON, intervalId;
        var _this = this;
        return __generator(this, function (_a) {
            CLOSE_BUTTON = "[data-tour-elem='guide-tooltip'] button.reactour__close";
            CONFIRM_BUTTON = "[data-id='dialog-container'] [data-qa='button-yes']";
            intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var TUTORIAL_DIALOG, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, page.$(CLOSE_BUTTON)];
                        case 1:
                            TUTORIAL_DIALOG = _a.sent();
                            if (!TUTORIAL_DIALOG) return [3 /*break*/, 4];
                            return [4 /*yield*/, page.locator(CLOSE_BUTTON).click()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, page.locator(CONFIRM_BUTTON).click()];
                        case 3:
                            _a.sent();
                            clearInterval(intervalId);
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            console.error("An error occurred while trying to close the tutorial:", error_1);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }, interval_ms);
            return [2 /*return*/, intervalId];
        });
    });
}
function closeNoAudioDialog(page, interval_ms) {
    if (interval_ms === void 0) { interval_ms = 1000; }
    return __awaiter(this, void 0, void 0, function () {
        var CLOSE_BUTTON, intervalId;
        var _this = this;
        return __generator(this, function (_a) {
            CLOSE_BUTTON = "[data-test-id='MODAL_HEADER_CLOSE_ICON']";
            intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var NO_AUDIO_DIALOG;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.$('[data-qa="select-source"]')];
                        case 1:
                            NO_AUDIO_DIALOG = _a.sent();
                            if (!NO_AUDIO_DIALOG) return [3 /*break*/, 3];
                            return [4 /*yield*/, page.locator(CLOSE_BUTTON).click()];
                        case 2:
                            _a.sent();
                            clearInterval(intervalId);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, interval_ms);
            return [2 /*return*/, intervalId];
        });
    });
}
function closeVoiceMailDialog(page, interval_ms) {
    if (interval_ms === void 0) { interval_ms = 1000; }
    return __awaiter(this, void 0, void 0, function () {
        var CLOSE_BUTTON, intervalId;
        var _this = this;
        return __generator(this, function (_a) {
            CLOSE_BUTTON = "[data-test-id='MODAL_HEADER_CLOSE_ICON']";
            intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var VOICE_MAIL_DIALOG;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.$("[data-qa='upload']")];
                        case 1:
                            VOICE_MAIL_DIALOG = _a.sent();
                            if (!VOICE_MAIL_DIALOG) return [3 /*break*/, 3];
                            return [4 /*yield*/, page.locator(CLOSE_BUTTON).click()];
                        case 2:
                            _a.sent();
                            clearInterval(intervalId);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, interval_ms);
            return [2 /*return*/, intervalId];
        });
    });
}
sendTextMessage;
