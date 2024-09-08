"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCache = void 0;
var QueryCache = /** @class */ (function () {
    function QueryCache() {
        this.cache = new Map();
    }
    QueryCache.prototype.set = function (key, data) {
        this.cache.set(key, { data: data, timestamp: Date.now() });
    };
    QueryCache.prototype.get = function (key) {
        var entry = this.cache.get(key);
        return entry === null || entry === void 0 ? void 0 : entry.data;
    };
    QueryCache.prototype.getTimestamp = function (key) {
        var _a;
        return (_a = this.cache.get(key)) === null || _a === void 0 ? void 0 : _a.timestamp;
    };
    QueryCache.prototype.delete = function (key) {
        this.cache.delete(key);
    };
    QueryCache.prototype.clear = function () {
        this.cache.clear();
    };
    return QueryCache;
}());
exports.queryCache = new QueryCache();
