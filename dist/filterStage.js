"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterStage = /** @class */ (function () {
    function FilterStage(predicate) {
        this.predicate = predicate;
    }
    FilterStage.prototype.emit = function (events) {
        return events.filter(this.predicate);
    };
    FilterStage.prototype.flush = function () {
        return Promise.resolve();
    };
    return FilterStage;
}());
exports.FilterStage = FilterStage;
