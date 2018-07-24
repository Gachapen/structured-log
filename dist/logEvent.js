"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the severity level of a log event.
 */
var LogEventLevel;
(function (LogEventLevel) {
    LogEventLevel[LogEventLevel["off"] = 0] = "off";
    LogEventLevel[LogEventLevel["fatal"] = 1] = "fatal";
    LogEventLevel[LogEventLevel["error"] = 3] = "error";
    LogEventLevel[LogEventLevel["warning"] = 7] = "warning";
    LogEventLevel[LogEventLevel["information"] = 15] = "information";
    LogEventLevel[LogEventLevel["debug"] = 31] = "debug";
    LogEventLevel[LogEventLevel["verbose"] = 63] = "verbose";
})(LogEventLevel = exports.LogEventLevel || (exports.LogEventLevel = {}));
/**
 * Checks if a log event level includes the target log event level.
 * @param {LogEventLevel} level The level to check.
 * @param {LogEventLevel} target The target level.
 * @returns True if the checked level contains the target level, or if the checked level is undefined.
 */
function isEnabled(level, target) {
    return typeof level === 'undefined' || (level & target) === target;
}
exports.isEnabled = isEnabled;
/**
 * Represents a log event.
 */
var LogEvent = /** @class */ (function () {
    /**
     * Creates a new log event instance.
     */
    function LogEvent(timestamp, level, messageTemplate, properties, error) {
        this.timestamp = timestamp;
        this.level = level;
        this.messageTemplate = messageTemplate;
        this.properties = properties || {};
        this.error = error || null;
    }
    return LogEvent;
}());
exports.LogEvent = LogEvent;
