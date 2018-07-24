"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logEvent_1 = require("./logEvent");
var filterStage_1 = require("./filterStage");
/**
 * Allows dynamic control of the logging level.
 */
var DynamicLevelSwitch = /** @class */ (function () {
    function DynamicLevelSwitch() {
        this.minLevel = null;
        /**
         * Gets or sets a delegate that can be called when the pipeline needs to be flushed.
         * This should generally not be modified, as it will be provided by the pipeline stage.
         */
        this.flushDelegate = function () { return Promise.resolve(); };
    }
    DynamicLevelSwitch.prototype.fatal = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.fatal; });
    };
    DynamicLevelSwitch.prototype.error = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.error; });
    };
    DynamicLevelSwitch.prototype.warning = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.warning; });
    };
    DynamicLevelSwitch.prototype.information = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.information; });
    };
    DynamicLevelSwitch.prototype.debug = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.debug; });
    };
    DynamicLevelSwitch.prototype.verbose = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.verbose; });
    };
    DynamicLevelSwitch.prototype.off = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = logEvent_1.LogEventLevel.off; });
    };
    DynamicLevelSwitch.prototype.isEnabled = function (level) {
        return this.minLevel === null || logEvent_1.isEnabled(this.minLevel, level);
    };
    return DynamicLevelSwitch;
}());
exports.DynamicLevelSwitch = DynamicLevelSwitch;
var DynamicLevelSwitchStage = /** @class */ (function (_super) {
    __extends(DynamicLevelSwitchStage, _super);
    function DynamicLevelSwitchStage(dynamicLevelSwitch) {
        var _this = _super.call(this, function (e) { return dynamicLevelSwitch.isEnabled(e.level); }) || this;
        _this.dynamicLevelSwitch = dynamicLevelSwitch;
        return _this;
    }
    /**
     * Sets a delegate that can be called when the pipeline needs to be flushed.
     */
    DynamicLevelSwitchStage.prototype.setFlushDelegate = function (flushDelegate) {
        this.dynamicLevelSwitch.flushDelegate = flushDelegate;
    };
    return DynamicLevelSwitchStage;
}(filterStage_1.FilterStage));
exports.DynamicLevelSwitchStage = DynamicLevelSwitchStage;
