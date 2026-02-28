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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { CONFIG } from "./config.js";
var currencyFromSelect = document.getElementById('from-currency');
var currencyToSelect = document.getElementById('to-currency');
var COUNTRY_LIST_API = CONFIG.COUNTRY_LIST_API;
function populateCurrencyDropdowns() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, currencyMap_1, sortedCurrencies, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(COUNTRY_LIST_API)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    currencyMap_1 = new Map();
                    data.forEach(function (country) {
                        if (country.currencies) {
                            var currencyCodes = Object.keys(country.currencies);
                            currencyCodes.forEach(function (currencyCode) {
                                if (!currencyMap_1.has(currencyCode)) {
                                    var currencyName = country.currencies[currencyCode].name;
                                    var flag = country.flag;
                                    var displayText = "".concat(flag, " ").concat(currencyCode, " - ").concat(currencyName);
                                    currencyMap_1.set(currencyCode, displayText);
                                }
                            });
                        }
                    });
                    sortedCurrencies = Array.from(currencyMap_1.entries()).sort(function (a, b) { return a[0].localeCompare(b[0]); });
                    currencyFromSelect.innerHTML = '';
                    currencyToSelect.innerHTML = '';
                    sortedCurrencies.forEach(function (_a) {
                        var currencyCode = _a[0], displayText = _a[1];
                        var fromOption = document.createElement('option');
                        fromOption.value = currencyCode;
                        fromOption.textContent = displayText;
                        var toOption = document.createElement('option');
                        toOption.value = currencyCode;
                        toOption.textContent = displayText;
                        if (currencyCode === 'USD')
                            fromOption.selected = true;
                        if (currencyCode == 'INR')
                            toOption.selected = true;
                        currencyFromSelect.appendChild(fromOption);
                        currencyToSelect.appendChild(toOption);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to fetch and populate currencies:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
populateCurrencyDropdowns();
var amountInput = document.getElementById('amount');
var convertButton = document.getElementById('convert-btn');
var resultMessage = document.getElementById('result-message');
var errorMessage = document.getElementById('error-message');
convertButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var amountValue, fromCurrency, toCurrency, amount, url, response, data, exchangeRate, convertedAmount, formatter, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amountValue = amountInput.value;
                fromCurrency = currencyFromSelect.value;
                toCurrency = currencyToSelect.value;
                if (!amountValue || parseFloat(amountValue) <= 0) {
                    errorMessage.textContent = "Please enter a valid amount greater than 0.";
                    errorMessage.style.display = 'block';
                    resultMessage.style.display = 'none';
                    return [2 /*return*/];
                }
                amount = parseFloat(amountValue);
                convertButton.textContent = "Converting...";
                errorMessage.style.display = 'none';
                resultMessage.style.display = 'none';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                url = "".concat(CONFIG.EXCHANGE_RATE_BASE_URL).concat(CONFIG.EXCHANGE_RATE_API_KEY, "/pair/").concat(fromCurrency, "/").concat(toCurrency);
                return [4 /*yield*/, fetch(url)];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("API Error: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                exchangeRate = parseFloat(data.conversion_rate);
                convertedAmount = exchangeRate * amount;
                formatter = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                resultMessage.textContent = "".concat(amount, " ").concat(fromCurrency, " = ").concat(formatter.format(convertedAmount), " ").concat(toCurrency);
                resultMessage.style.display = 'block';
                return [3 /*break*/, 6];
            case 4:
                error_2 = _a.sent();
                errorMessage.textContent = "An error occurred, please try again later";
                errorMessage.style.display = 'block';
                return [3 /*break*/, 6];
            case 5:
                convertButton.textContent = "Convert";
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
