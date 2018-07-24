"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deepClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var EnrichStage = /** @class */ (function () {
    function EnrichStage(enricher) {
        this.enricher = enricher;
    }
    EnrichStage.prototype.emit = function (events) {
        for (var i = 0; i < events.length; ++i) {
            var extraProperties = this.enricher instanceof Function
                ? this.enricher(deepClone(events[i].properties))
                : this.enricher;
            Object.assign(events[i].properties, extraProperties);
        }
        return events;
    };
    EnrichStage.prototype.flush = function () {
        return Promise.resolve();
    };
    return EnrichStage;
}());
exports.EnrichStage = EnrichStage;
