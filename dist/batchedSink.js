"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var messageTemplate_1 = require("./messageTemplate");
exports.defaultBatchedSinkOptions = {
    maxSize: 100,
    period: 5,
    durableStore: null
};
var BatchedSink = /** @class */ (function () {
    function BatchedSink(innerSink, options) {
        this.durableStorageKey = 'structured-log-batched-sink-durable-cache';
        this.innerSink = innerSink || null;
        this.options = __assign({}, exports.defaultBatchedSinkOptions, (options || {}));
        this.batchedEvents = [];
        this.cycleBatch();
        if (this.options.durableStore) {
            var initialBatch = [];
            for (var key in this.options.durableStore) {
                if (key.indexOf(this.durableStorageKey) === 0) {
                    var storedEvents = JSON.parse(this.options.durableStore.getItem(key))
                        .map(function (e) {
                        e.messageTemplate = new messageTemplate_1.MessageTemplate(e.messageTemplate.raw);
                        return e;
                    });
                    initialBatch = initialBatch.concat(storedEvents);
                    this.options.durableStore.removeItem(key);
                }
            }
            this.emit(initialBatch);
        }
    }
    BatchedSink.prototype.emit = function (events) {
        if (this.batchedEvents.length + events.length <= this.options.maxSize) {
            (_a = this.batchedEvents).push.apply(_a, events);
            this.storeEvents();
        }
        else {
            var cursor = this.options.maxSize - this.batchedEvents.length < 0 ? 0 :
                this.options.maxSize - this.batchedEvents.length;
            (_b = this.batchedEvents).push.apply(_b, events.slice(0, cursor));
            this.storeEvents();
            while (cursor < events.length) {
                this.cycleBatch();
                (_c = this.batchedEvents).push.apply(_c, events.slice(cursor, cursor = cursor + this.options.maxSize));
                this.storeEvents();
            }
        }
        return events;
        var _a, _b, _c;
    };
    BatchedSink.prototype.flush = function () {
        this.cycleBatch();
        var corePromise = this.flushCore();
        return corePromise instanceof Promise ? corePromise : Promise.resolve();
    };
    BatchedSink.prototype.emitCore = function (events) {
        return this.innerSink.emit(events);
    };
    BatchedSink.prototype.flushCore = function () {
        return this.innerSink.flush();
    };
    BatchedSink.prototype.cycleBatch = function () {
        var _this = this;
        clearTimeout(this.batchTimeout);
        if (this.batchedEvents.length) {
            var processEvents = this.batchedEvents.slice(0);
            this.batchedEvents.length = 0;
            var emitPromise = this.emitCore(processEvents);
            (emitPromise instanceof Promise ? emitPromise : Promise.resolve())
                .then(function () {
                if (_this.options.durableStore) {
                    var previousBatchKey = _this.batchKey;
                    return _this.options.durableStore.removeItem(previousBatchKey);
                }
            }).catch(function () {
                (_a = _this.batchedEvents).unshift.apply(_a, processEvents);
                var _a;
            });
        }
        this.batchKey = this.durableStorageKey + "-" + new Date().getTime();
        if (!isNaN(this.options.period) && this.options.period > 0) {
            this.batchTimeout = setTimeout(function () { return _this.cycleBatch(); }, this.options.period * 1000);
        }
    };
    BatchedSink.prototype.storeEvents = function () {
        if (this.options.durableStore) {
            this.options.durableStore.setItem(this.batchKey, JSON.stringify(this.batchedEvents));
        }
    };
    return BatchedSink;
}());
exports.BatchedSink = BatchedSink;
