"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfills/objectAssign");
var logEvent_1 = require("./logEvent");
exports.LogEventLevel = logEvent_1.LogEventLevel;
var logger_1 = require("./logger");
exports.Logger = logger_1.Logger;
var consoleSink_1 = require("./consoleSink");
exports.ConsoleSink = consoleSink_1.ConsoleSink;
var batchedSink_1 = require("./batchedSink");
exports.BatchedSink = batchedSink_1.BatchedSink;
var dynamicLevelSwitch_1 = require("./dynamicLevelSwitch");
exports.DynamicLevelSwitch = dynamicLevelSwitch_1.DynamicLevelSwitch;
var loggerConfiguration_1 = require("./loggerConfiguration");
exports.LoggerConfiguration = loggerConfiguration_1.LoggerConfiguration;
function configure() {
    return new loggerConfiguration_1.LoggerConfiguration();
}
exports.configure = configure;
