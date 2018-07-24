"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SinkStage = /** @class */ (function () {
    function SinkStage(sink) {
        this.sink = sink;
    }
    SinkStage.prototype.emit = function (events) {
        this.sink.emit(events);
        return events;
    };
    SinkStage.prototype.flush = function () {
        return this.sink.flush();
    };
    return SinkStage;
}());
exports.SinkStage = SinkStage;
