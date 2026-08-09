/**
 * Multi-currency helpers — catalogue prices are stored in MAD (base).
 * Rates = how many MAD equal 1 unit of that currency (approx; editable via API settings).
 */
(function (root) {
  "use strict";

  var DEFAULT_RATES = {
    MAD: 1,
    USD: 10,
    EUR: 10.8,
    GBP: 12.5,
  };

  var LABELS = {
    MAD: "MAD",
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
  };

  var SYMBOLS = {
    MAD: "MAD",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  function Currency(rates) {
    this.rates = Object.assign({}, DEFAULT_RATES, rates || {});
    this.code = "MAD";
    try {
      var saved = localStorage.getItem("em_currency");
      if (saved && this.rates[saved]) this.code = saved;
    } catch (e) {}
  }

  Currency.prototype.setRates = function (rates) {
    this.rates = Object.assign({}, DEFAULT_RATES, rates || {});
  };

  Currency.prototype.setCode = function (code) {
    if (!this.rates[code]) return;
    this.code = code;
    try {
      localStorage.setItem("em_currency", code);
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("em:currency", { detail: { code: code } }));
  };

  Currency.prototype.fromMad = function (amountMad) {
    if (amountMad == null || isNaN(amountMad)) return null;
    var rate = this.rates[this.code] || 1;
    if (this.code === "MAD") return Math.round(Number(amountMad));
    return Math.round((Number(amountMad) / rate) * 100) / 100;
  };

  Currency.prototype.toMad = function (amount, fromCode) {
    var code = fromCode || this.code;
    var rate = this.rates[code] || 1;
    if (code === "MAD") return Math.round(Number(amount));
    return Math.round(Number(amount) * rate);
  };

  Currency.prototype.format = function (amountMad, forceCode) {
    var code = forceCode || this.code;
    var rate = this.rates[code] || 1;
    var value =
      code === "MAD"
        ? Math.round(Number(amountMad))
        : Math.round((Number(amountMad) / rate) * 100) / 100;
    var formatted = new Intl.NumberFormat(code === "MAD" ? "fr-MA" : "en-US", {
      minimumFractionDigits: code === "MAD" ? 0 : 2,
      maximumFractionDigits: code === "MAD" ? 0 : 2,
    }).format(value);
    if (code === "MAD") return formatted + " MAD";
    if (code === "USD") return "$" + formatted;
    if (code === "EUR") return "€" + formatted;
    if (code === "GBP") return "£" + formatted;
    return formatted + " " + code;
  };

  Currency.prototype.formatFrom = function (amount, code) {
    return this.format(this.toMad(amount, code), code);
  };

  Currency.prototype.codes = function () {
    return Object.keys(LABELS);
  };

  Currency.prototype.label = function (code) {
    return LABELS[code || this.code] || code;
  };

  root.EM = root.EM || {};
  root.EM.CurrencyDefaults = { rates: DEFAULT_RATES, labels: LABELS, symbols: SYMBOLS };
  root.EM.createCurrency = function (rates) {
    return new Currency(rates);
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { DEFAULT_RATES: DEFAULT_RATES, Currency: Currency };
  }
})(typeof window !== "undefined" ? window : global);
