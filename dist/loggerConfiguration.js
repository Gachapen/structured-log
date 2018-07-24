"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pipeline_1 = require("./pipeline");
var logger_1 = require("./logger");
var logEvent_1 = require("./logEvent");
var dynamicLevelSwitch_1 = require("./dynamicLevelSwitch");
var filterStage_1 = require("./filterStage");
var sink_1 = require("./sink");
var enrichStage_1 = require("./enrichStage");
/**
 * Configures pipelines for new logger instances.
 */
var LoggerConfiguration = /** @class */ (function () {
    function LoggerConfiguration() {
        var _this = this;
        /**
         * Sets the minimum level for any subsequent stages in the pipeline.
         */
        this.minLevel = Object.assign(function (levelOrSwitch) {
            if (typeof levelOrSwitch === 'undefined' || levelOrSwitch === null) {
                throw new TypeError('Argument "levelOrSwitch" is not a valid LogEventLevel value or DynamicLevelSwitch instance.');
            }
            else if (levelOrSwitch instanceof dynamicLevelSwitch_1.DynamicLevelSwitch) {
                var switchStage = new dynamicLevelSwitch_1.DynamicLevelSwitchStage(levelOrSwitch);
                var flush = _this.pipeline.flush;
                switchStage.setFlushDelegate(function () { return _this.pipeline.flush(); });
                _this.pipeline.addStage(switchStage);
                return _this;
            }
            else if (typeof levelOrSwitch === 'string') {
                var level_1 = logEvent_1.LogEventLevel[levelOrSwitch.toLowerCase()];
                if (typeof level_1 === 'undefined' || level_1 === null) {
                    throw new TypeError('Argument "levelOrSwitch" is not a valid LogEventLevel value.');
                }
                return _this.filter(function (e) { return logEvent_1.isEnabled(level_1, e.level); });
            }
            else {
                return _this.filter(function (e) { return logEvent_1.isEnabled(levelOrSwitch, e.level); });
            }
        }, {
            fatal: function () { return _this.minLevel(logEvent_1.LogEventLevel.fatal); },
            error: function () { return _this.minLevel(logEvent_1.LogEventLevel.error); },
            warning: function () { return _this.minLevel(logEvent_1.LogEventLevel.warning); },
            information: function () { return _this.minLevel(logEvent_1.LogEventLevel.information); },
            debug: function () { return _this.minLevel(logEvent_1.LogEventLevel.debug); },
            verbose: function () { return _this.minLevel(logEvent_1.LogEventLevel.verbose); }
        });
        this.pipeline = new pipeline_1.Pipeline();
        this._suppressErrors = true;
    }
    /**
     * Adds a sink to the pipeline.
     * @param {Sink} sink The sink to add.
     */
    LoggerConfiguration.prototype.writeTo = function (sink) {
        this.pipeline.addStage(new sink_1.SinkStage(sink));
        return this;
    };
    /**
     * Adds a filter to the pipeline.
     * @param {(e: LogEvent) => boolean} predicate Filter predicate to use.
     */
    LoggerConfiguration.prototype.filter = function (predicate) {
        if (predicate instanceof Function) {
            this.pipeline.addStage(new filterStage_1.FilterStage(predicate));
        }
        else {
            throw new TypeError('Argument "predicate" must be a function.');
        }
        return this;
    };
    /**
     * Adds an enricher to the pipeline.
     */
    LoggerConfiguration.prototype.enrich = function (enricher) {
        if (enricher instanceof Function || enricher instanceof Object) {
            this.pipeline.addStage(new enrichStage_1.EnrichStage(enricher));
        }
        else {
            throw new TypeError('Argument "enricher" must be either a function or an object.');
        }
        return this;
    };
    /**
     * Enable or disable error suppression.
     */
    LoggerConfiguration.prototype.suppressErrors = function (suppress) {
        this._suppressErrors = typeof suppress === 'undefined' || !!suppress;
        return this;
    };
    /**
     * Creates a new logger instance based on this configuration.
     */
    LoggerConfiguration.prototype.create = function () {
        return new logger_1.Logger(this.pipeline, this._suppressErrors);
    };
    return LoggerConfiguration;
}());
exports.LoggerConfiguration = LoggerConfiguration;
