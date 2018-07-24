"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pipeline = /** @class */ (function () {
    function Pipeline() {
        this.stages = [];
        this.eventQueue = [];
        this.flushInProgress = false;
    }
    /**
     * Adds a stage to the end of the pipeline.
     * @param {PipelineStage} stage The pipeline stage to add.
     */
    Pipeline.prototype.addStage = function (stage) {
        this.stages.push(stage);
    };
    /**
     * Emits events through the pipeline. If a flush is currently in progress, the events will be queued and will been
     * sent through the pipeline once the flush is complete.
     * @param {LogEvent[]} events The events to emit.
     */
    Pipeline.prototype.emit = function (events) {
        var _this = this;
        if (this.flushInProgress) {
            this.eventQueue = this.eventQueue.concat(events);
            return this.flushPromise;
        }
        else {
            if (!this.stages.length || !events.length) {
                return Promise.resolve();
            }
            var promise = Promise.resolve(this.stages[0].emit(events));
            var _loop_1 = function (i) {
                promise = promise.then(function (events) { return _this.stages[i].emit(events); });
            };
            for (var i = 1; i < this.stages.length; ++i) {
                _loop_1(i);
            }
            return promise;
        }
    };
    /**
     * Flushes events through the pipeline.
     * @returns A {Promise<any>} that resolves when all events have been flushed and the pipeline can accept new events.
     */
    Pipeline.prototype.flush = function () {
        var _this = this;
        if (this.flushInProgress) {
            return this.flushPromise;
        }
        this.flushInProgress = true;
        return this.flushPromise = Promise.resolve()
            .then(function () {
            if (_this.stages.length === 0) {
                return;
            }
            var promise = _this.stages[0].flush();
            var _loop_2 = function (i) {
                promise = promise.then(function () { return _this.stages[i].flush(); });
            };
            for (var i = 1; i < _this.stages.length; ++i) {
                _loop_2(i);
            }
            return promise;
        })
            .then(function () {
            _this.flushInProgress = false;
            var queuedEvents = _this.eventQueue.slice();
            _this.eventQueue = [];
            return _this.emit(queuedEvents);
        });
    };
    return Pipeline;
}());
exports.Pipeline = Pipeline;
