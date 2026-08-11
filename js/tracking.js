/**
 * Tracking — GA4, Google Ads, Meta Pixel (consent-aware)
 * IDs come from /api/config (env vars on the server).
 * GA tag is also embedded in page <head> so Google can detect it;
 * cookies/storage stay denied until the visitor accepts.
 */
(function () {
  "use strict";

  var CONSENT_KEY = "em_tracking_consent";
  /** Fallback when production .env is missing GA_MEASUREMENT_ID */
  var FALLBACK_GA_ID = "G-3JSSYBLXW5";

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function ensureDataLayer() {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }
  }

  function resolveGaId(config) {
    return (config && config.googleAnalyticsId) || FALLBACK_GA_ID || "";
  }

  function loadGtagScript(gaId) {
    if (document.querySelector("script[data-em-gtag]")) return;
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
    if (!gaId) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    s.setAttribute("data-em-gtag", "1");
    document.head.appendChild(s);
  }

  function whenBrowserIdle(fn) {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(fn, { timeout: 4000 });
      return;
    }
    window.setTimeout(fn, 2000);
  }

  function afterLoad(fn) {
    if (document.readyState === "complete") {
      whenBrowserIdle(fn);
      return;
    }
    window.addEventListener(
      "load",
      function () {
        whenBrowserIdle(fn);
      },
      { once: true }
    );
  }

  function setConsentGranted() {
    ensureDataLayer();
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  }

  function injectGoogleTags(config, opts) {
    opts = opts || {};
    var gaId = resolveGaId(config);
    var adsId = (config && config.googleAdsId) || "";
    if (!gaId && !adsId) return;

    ensureDataLayer();

    function apply() {
      loadGtagScript(gaId || adsId);
      window.gtag("js", new Date());
      if (opts.grantConsent) setConsentGranted();
      if (gaId) {
        window.gtag("config", gaId, {
          anonymize_ip: true,
          send_page_view: !!opts.grantConsent,
        });
      }
      if (adsId) {
        window.gtag("config", adsId);
      }
      if (opts.grantConsent && gaId) {
        window.gtag("event", "page_view");
      }
    }

    // Defer network load so LCP/FCP are not competing with Analytics.
    if (opts.immediate) apply();
    else afterLoad(apply);
  }

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
    window.fbq("init", id);
    window.fbq("track", "PageView");
  }

  function injectSiteVerification(code) {
    if (!code) return;
    if (document.querySelector('meta[name="google-site-verification"]')) return;
    var meta = document.createElement("meta");
    meta.name = "google-site-verification";
    meta.content = code;
    document.head.appendChild(meta);
  }

  function denyConsentDefaults() {
    ensureDataLayer();
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
  }

  function mountConsentBanner(config) {
    if (document.getElementById("em-consent")) return;
    var consent = getConsent();
    if (consent === "granted" || consent === "denied") return;

    var bar = document.createElement("div");
    bar.id = "em-consent";
    bar.className = "consent-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie consent");
    bar.innerHTML =
      '<div class="consent-bar__inner">' +
      "<p>" +
      (window.EM && EM.t
        ? EM.t("consent.text")
        : "We use cookies for analytics and ads to improve your experience and measure bookings. See our") +
      ' <a href="/privacy">' +
      (window.EM && EM.t ? EM.t("consent.privacy") : "Privacy Policy") +
      "</a>.</p>" +
      '<div class="consent-bar__actions">' +
      '<button type="button" class="btn btn--secondary" data-consent="denied">' +
      (window.EM && EM.t ? EM.t("consent.reject") : "Essential only") +
      "</button>" +
      '<button type="button" class="btn btn--primary" data-consent="granted">' +
      (window.EM && EM.t ? EM.t("consent.accept") : "Accept") +
      "</button>" +
      "</div></div>";
    document.body.appendChild(bar);

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var value = btn.getAttribute("data-consent");
      setConsent(value);
      bar.remove();
      if (value === "granted") {
        injectGoogleTags(config, { grantConsent: true, immediate: true });
        injectMetaPixel(config.metaPixelId);
      }
    });
  }

  window.EM = window.EM || {};

  EM.getTrackingConsent = getConsent;

  EM.initTracking = function (config) {
    if (!config) config = {};
    injectSiteVerification(config.googleSiteVerification);

    denyConsentDefaults();

    var gaId = resolveGaId(config);
    var hasMarketing = !!(gaId || config.googleAdsId || config.metaPixelId);

    // Always register the Google tag (so GA can detect it), but keep storage denied
    // until the visitor accepts cookies.
    if (gaId || config.googleAdsId) {
      injectGoogleTags(config, { grantConsent: false });
    }

    var consent = getConsent();
    if (consent === "granted") {
      injectGoogleTags(config, { grantConsent: true, immediate: true });
      injectMetaPixel(config.metaPixelId);
      return;
    }
    if (consent === "denied") return;
    if (!hasMarketing) return;
    mountConsentBanner(config);
  };

  /**
   * Fire analytics events.
   * Maps Meta-style names to GA4 recommended events where useful.
   */
  EM.trackEvent = function (name, params) {
    params = params || {};
    var consent = getConsent();
    if (consent === "denied") return;

    if (window.fbq) {
      try {
        window.fbq("track", name, params);
      } catch (e) {
        /* ignore */
      }
    }

    if (!window.gtag) return;

    var gaParams = Object.assign({}, params);
    if (name === "Lead" || name === "generate_lead") {
      window.gtag("event", "generate_lead", gaParams);
    } else if (name === "Purchase" || name === "purchase") {
      window.gtag("event", "purchase", {
        currency: gaParams.currency || "MAD",
        value: gaParams.value || 0,
        items: gaParams.content_name
          ? [{ item_name: gaParams.content_name }]
          : undefined,
      });
    } else if (name === "view_item" || name === "ViewContent") {
      window.gtag("event", "view_item", gaParams);
    } else if (name === "InitiateCheckout" || name === "begin_checkout") {
      window.gtag("event", "begin_checkout", gaParams);
    } else {
      window.gtag("event", name, gaParams);
    }

    var adsId = EM.config && EM.config.googleAdsId;
    var label = EM.config && EM.config.googleAdsConversionLabel;
    if (
      adsId &&
      label &&
      (name === "Lead" ||
        name === "generate_lead" ||
        name === "Purchase" ||
        name === "purchase")
    ) {
      window.gtag("event", "conversion", {
        send_to: adsId + "/" + label,
        value: params.value || 1,
        currency: params.currency || "MAD",
      });
    }
  };
})();
