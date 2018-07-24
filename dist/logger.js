"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logEvent_1 = require("./logEvent");
var messageTemplate_1 = require("./messageTemplate");
/**
 * Logs events.
 */
var Logger = /** @class */ (function () {
    /**
     * Creates a new logger instance using the specified pipeline.
     */
    function Logger(pipeline, suppressErrors) {
        this.suppressErrors = true;
        this.pipeline = pipeline;
        this.suppressErrors = typeof suppressErrors === 'undefined' || suppressErrors;
    }
    Logger.prototype.fatal = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.fatal, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.fatal, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.error = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.error, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.error, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.warn = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.warning, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.warning, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.info = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.information, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.information, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.debug = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.debug, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.debug, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.verbose = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(logEvent_1.LogEventLevel.verbose, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(logEvent_1.LogEventLevel.verbose, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    /**
     * Flushes the pipeline of this logger.
     * @returns A {Promise<any>} that will resolve when the pipeline has been flushed.
     */
    Logger.prototype.flush = function () {
        return this.suppressErrors
            ? this.pipeline.flush().catch(function () { })
            : this.pipeline.flush();
    };
    /**
     * Emits events through this logger's pipeline.
     */
    Logger.prototype.emit = function (events) {
        try {
            this.pipeline.emit(events);
            return events;
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.write = function (level, rawMessageTemplate, unboundProperties, error) {
        var messageTemplate = new messageTemplate_1.MessageTemplate(rawMessageTemplate);
        var properties = messageTemplate.bindProperties(unboundProperties);
        var logEvent = new logEvent_1.LogEvent(new Date().toISOString(), level, messageTemplate, properties, error);
        this.pipeline.emit([logEvent]);
    };
    return Logger;
}());
exports.Logger = Logger;
