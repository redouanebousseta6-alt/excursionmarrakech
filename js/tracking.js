/**
 * Meta Pixel / Google Ads placeholders — IDs come from /api/config
 */
(function () {
  "use strict";

  function injectMetaPixel(id) {
    if (!id || window.fbq) return;
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", id);
    fbq("track", "PageView");
  }

  function injectGoogleAds(id) {
    if (!id) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  }

  window.EM = window.EM || {};
  EM.initTracking = function (config) {
    if (!config) return;
    if (config.metaPixelId) injectMetaPixel(config.metaPixelId);
    if (config.googleAdsId) injectGoogleAds(config.googleAdsId);
  };

  EM.trackEvent = function (name, params) {
    if (window.fbq) fbq("track", name, params || {});
    if (window.gtag) gtag("event", name, params || {});
  };
})();
