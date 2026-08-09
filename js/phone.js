/**
 * Phone country dial codes for booking form
 */
window.EM = window.EM || {};

EM.PHONE_COUNTRIES = [
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "TN", name: "Tunisia", dial: "+216", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿" },
];

EM.getPhoneCountry = function (code) {
  return EM.PHONE_COUNTRIES.find(function (c) {
    return c.code === code;
  }) || EM.PHONE_COUNTRIES[0];
};

EM.formatPhoneE164 = function (countryCode, nationalNumber) {
  var c = EM.getPhoneCountry(countryCode);
  var digits = String(nationalNumber || "").replace(/[^\d]/g, "");
  // Drop leading 0 common in national formats
  if (digits.charAt(0) === "0") digits = digits.slice(1);
  return c.dial + " " + digits;
};

EM.buildPhoneFieldHtml = function (opts) {
  opts = opts || {};
  var id = opts.id || "phone";
  var selected = opts.selected || "MA";
  var options = EM.PHONE_COUNTRIES.map(function (c) {
    return (
      '<option value="' +
      c.code +
      '"' +
      (c.code === selected ? " selected" : "") +
      ">" +
      c.flag +
      " " +
      c.code +
      " (" +
      c.dial +
      ")</option>"
    );
  }).join("");

  return (
    '<div class="form-group">' +
    '<label for="' +
    id +
    '-number">Phone</label>' +
    '<div class="phone-field">' +
    '<select id="' +
    id +
    '-country" name="phoneCountry" class="phone-field__country" aria-label="Phone country" required>' +
    options +
    "</select>" +
    '<div class="phone-field__input-wrap">' +
    '<input id="' +
    id +
    '-number" name="phone" type="tel" class="phone-field__number" autocomplete="tel-national" required placeholder="Phone number" inputmode="tel" />' +
    '<span class="phone-field__icon" aria-hidden="true">📞</span>' +
    "</div>" +
    "</div>" +
    '<p class="phone-field__hint" id="' +
    id +
    '-hint">Example: +212 612-345678</p>' +
    "</div>"
  );
};

EM.initPhoneField = function (rootId) {
  var country = document.getElementById(rootId + "-country");
  var number = document.getElementById(rootId + "-number");
  var hint = document.getElementById(rootId + "-hint");
  var icon = number && number.parentElement.querySelector(".phone-field__icon");
  if (!country || !number) return;

  function updateHint() {
    var c = EM.getPhoneCountry(country.value);
    if (hint) hint.textContent = "Example: " + c.dial + " 612-345678";
    var digits = String(number.value || "").replace(/[^\d]/g, "");
    if (icon) icon.classList.toggle("is-valid", digits.length >= 6);
  }

  country.addEventListener("change", updateHint);
  number.addEventListener("input", updateHint);
  updateHint();
};
