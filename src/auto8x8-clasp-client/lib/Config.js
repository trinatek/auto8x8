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
var Config = /** @class */ (function () {
    function Config(sheetName, configKey, configValue) {
        if (sheetName === void 0) { sheetName = "Config"; }
        if (configKey === void 0) { configKey = "configKey"; }
        if (configValue === void 0) { configValue = "configValue"; }
        this.calendarId = "";
        this.gitHubUser = "";
        this.gitHubRepo = "";
        this.gitHubAuthToken = "";
        this.gitHubEventType = "";
        this.emailSenderName = "";
        this.emailSenderAlias = "";
        this.emailRecipient = "";
        this.emailSubject = "";
        this.emailBody = "";
        var config = new GoogleSheets(sheetName).get(configKey, configValue);
        this.loadAsProperties(config);
        this.validateNoMissingKeys(config);
        this.validateNoMissingValues();
        console.log("[Config] Loaded config properties from '".concat(sheetName, "' Google Sheet."));
    }
    ////////////////////////
    ////   Protected    ////
    ////////////////////////
    Config.prototype.loadAsProperties = function (config) {
        var _this = this;
        var properties = Object.keys(config)
            .filter(function (k) { return _this.hasOwnProperty(k); })
            .reduce(function (acc, k) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[k] = config[k], _a)));
        }, {});
        Object.assign(this, properties);
    };
    Config.prototype.validateNoMissingKeys = function (config) {
        var missingKeys = Object.keys(this)
            .filter(function (key) { return !key.startsWith("_"); })
            .filter(function (key) { return !(key in config); });
        if (missingKeys.length) {
            throw new Error("[config] The following keys are missing from the sheet:" +
                "".concat(missingKeys.map(function (k) { return "\n  \u2022 ".concat(k); })));
        }
    };
    Config.prototype.validateNoMissingValues = function () {
        var _this = this;
        var missingKeyValues = Object.keys(this).filter(function (key) { return !key.startsWith("_") && !"".concat(_this[key]).trim().length; });
        if (missingKeyValues.length) {
            throw new Error("[config] \uD83D\uDD34 The following values are missing from these keys in the sheet:" +
                "".concat(missingKeyValues.map(function (k) { return "\n  \u2022 ".concat(k); })));
        }
    };
    return Config;
}());
