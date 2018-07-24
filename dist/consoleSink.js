"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logEvent_1 = require("./logEvent");
var ConsoleSink = /** @class */ (function () {
    function ConsoleSink(options) {
        this.options = options || {};
        var internalConsole = this.options.console || typeof console !== 'undefined' && console || null;
        var stub = function () { };
        // console.debug is no-op for Node, so use console.log instead.
        var nodeConsole = !this.options.console && typeof process !== 'undefined' && process.versions.node;
        this.console = {
            error: (internalConsole && (internalConsole.error || internalConsole.log)) || stub,
            warn: (internalConsole && (internalConsole.warn || internalConsole.log)) || stub,
            info: (internalConsole && (internalConsole.info || internalConsole.log)) || stub,
            debug: (internalConsole && ((!nodeConsole && internalConsole.debug) || internalConsole.log)) || stub,
            log: (internalConsole && internalConsole.log) || stub
        };
    }
    ConsoleSink.prototype.emit = function (events) {
        for (var i = 0; i < events.length; ++i) {
            var e = events[i];
            if (!logEvent_1.isEnabled(this.options.restrictedToMinimumLevel, e.level))
                continue;
            switch (e.level) {
                case logEvent_1.LogEventLevel.fatal:
                    this.writeToConsole(this.console.error, 'Fatal', e);
                    break;
                case logEvent_1.LogEventLevel.error:
                    this.writeToConsole(this.console.error, 'Error', e);
                    break;
                case logEvent_1.LogEventLevel.warning:
                    this.writeToConsole(this.console.warn, 'Warning', e);
                    break;
                case logEvent_1.LogEventLevel.information:
                    this.writeToConsole(this.console.info, 'Information', e);
                    break;
                case logEvent_1.LogEventLevel.debug:
                    this.writeToConsole(this.console.debug, 'Debug', e);
                    break;
                case logEvent_1.LogEventLevel.verbose:
                    this.writeToConsole(this.console.debug, 'Verbose', e);
                    break;
                default:
                    this.writeToConsole(this.console.log, 'Log', e);
                    break;
            }
        }
    };
    ConsoleSink.prototype.flush = function () {
        return Promise.resolve();
    };
    ConsoleSink.prototype.writeToConsole = function (logMethod, prefix, e) {
        var output = "[" + prefix + "] " + e.messageTemplate.render(e.properties);
        if (this.options.includeTimestamps) {
            output = e.timestamp + " " + output;
        }
        var values = [];
        if (this.options.includeProperties) {
            for (var key in e.properties) {
                if (e.properties.hasOwnProperty(key)) {
                    values.push(e.properties[key]);
                }
            }
        }
        if (e.error instanceof Error) {
            values.push('\n', e.error);
        }
        logMethod.apply(void 0, [output].concat(values));
    };
    return ConsoleSink;
}());
exports.ConsoleSink = ConsoleSink;
