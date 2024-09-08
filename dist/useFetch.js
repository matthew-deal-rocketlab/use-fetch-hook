"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetch = useFetch;
var react_1 = require("react");
var cache_1 = require("./cache");
var DEFAULT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
function hashQueryKey(fetchKey) {
    return fetchKey
        .map(function (key) { return (typeof key === "object" ? JSON.stringify(key) : String(key)); })
        .join("|");
}
function useFetch(_a) {
    var _this = this;
    var fetchKey = _a.fetchKey, fetchFn = _a.fetchFn, refetchInterval = _a.refetchInterval, _b = _a.cacheTTL, cacheTTL = _b === void 0 ? DEFAULT_CACHE_TTL : _b;
    var cacheKey = hashQueryKey(fetchKey);
    var _c = (0, react_1.useState)(function () {
        return cache_1.queryCache.get(cacheKey);
    }), data = _c[0], setData = _c[1];
    var _d = (0, react_1.useState)(!cache_1.queryCache.get(cacheKey)), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(false), isFetching = _e[0], setIsFetching = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var fetchAttempts = (0, react_1.useRef)(0);
    var maxAttempts = 3;
    var fetchData = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fetchAttempts.current >= maxAttempts) {
                        setError(new Error("Failed after ".concat(maxAttempts, " attempts")));
                        setIsLoading(false);
                        setIsFetching(false);
                        return [2 /*return*/];
                    }
                    setIsFetching(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchFn()];
                case 2:
                    result = _a.sent();
                    cache_1.queryCache.set(cacheKey, result);
                    setData(result);
                    fetchAttempts.current = 0;
                    setError(null);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    fetchAttempts.current++;
                    setError(err_1 instanceof Error ? err_1 : new Error("An error occurred"));
                    setData(undefined);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    setIsFetching(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [cacheKey, fetchFn]);
    (0, react_1.useEffect)(function () {
        var cachedTimestamp = cache_1.queryCache.getTimestamp(cacheKey);
        var isCacheExpired = !cachedTimestamp || Date.now() - cachedTimestamp > cacheTTL;
        if (!isCacheExpired && cache_1.queryCache.get(cacheKey)) {
            setData(cache_1.queryCache.get(cacheKey));
            setIsLoading(false);
            setIsFetching(false);
        }
        else if (!isFetching) {
            fetchAttempts.current = 0;
            fetchData();
        }
        var intervalId = null;
        if (refetchInterval && refetchInterval > 0) {
            intervalId = setInterval(function () {
                if (!isFetching) {
                    fetchAttempts.current = 0;
                    fetchData();
                }
            }, refetchInterval);
        }
        return function () {
            if (intervalId)
                clearInterval(intervalId);
        };
    }, [cacheKey, fetchData, refetchInterval, cacheTTL, isFetching]);
    var refetch = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchAttempts.current = 0;
                    return [4 /*yield*/, fetchData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [fetchData]);
    var invalidateQuery = (0, react_1.useCallback)(function () {
        cache_1.queryCache.delete(cacheKey);
        setData(undefined);
        fetchAttempts.current = 0;
        fetchData();
    }, [cacheKey, fetchData]);
    return { data: data, isLoading: isLoading, isFetching: isFetching, error: error, refetch: refetch, invalidateQuery: invalidateQuery };
}
