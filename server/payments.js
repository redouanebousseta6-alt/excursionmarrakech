const express = require("express");
const { db, rowToTrip } = require("./db");
const { computeTotal } = require("./pricing");

const router = express.Router();

function stripeEnabled() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return key && !key.includes("your_key");
}

function paypalEnabled() {
  const id = process.env.PAYPAL_CLIENT_ID || "";
  return id && !id.includes("your_paypal");
}

function getStripe() {
  if (!stripeEnabled()) return null;
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
}

async function paypalAccessToken() {
  const base =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  const data = await res.json();
  return { token: data.access_token, base };
}

/**
 * MAD is not always available on Stripe test accounts.
 * We charge in EUR equivalent for demo when STRIPE_CHARGE_CURRENCY=eur,
 * while storing MAD on the booking. Default: try mad, fallback documented in README.
 */
function stripeAmountAndCurrency(totalMad) {
  const currency = (process.env.STRIPE_CHARGE_CURRENCY || "mad").toLowerCase();
  if (currency === "eur") {
    // Approximate display conversion for sandbox demos only (~10 MAD ≈ 1 EUR)
    const eur = Math.max(1, Math.round(totalMad / 10));
    return { amount: eur * 100, currency: "eur", displayNote: `${totalMad} MAD (charged ~${eur} EUR in test)` };
  }
  return { amount: totalMad * 100, currency: "mad", displayNote: null };
}

// Create Stripe Checkout Session for an existing booking
router.post("/stripe/checkout", async (req, res) => {
  try {
    if (!stripeEnabled()) {
      return res.status(503).json({
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env",
      });
    }
    const { bookingId } = req.body || {};
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "paid") {
      return res.status(400).json({ error: "Booking already paid" });
    }

    const stripe = getStripe();
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const { amount, currency, displayNote } = stripeAmountAndCurrency(booking.total_amount);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.email,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: booking.trip_title,
              description: `Excursion booking · ${booking.travelers} traveler(s) · ${booking.travel_date}${
                displayNote ? " · " + displayNote : ""
              }`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        tripId: booking.trip_id,
        totalMad: String(booking.total_amount),
      },
      success_url: `${siteUrl}/booking-success?bookingId=${booking.id}&provider=stripe`,
      cancel_url: `${siteUrl}/${encodeURIComponent(booking.trip_id)}?bookingId=${booking.id}&cancelled=1`,
    });

    db.prepare(`
      UPDATE bookings SET
        status = 'pending_payment',
        payment_provider = 'stripe',
        payment_id = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(session.id, booking.id);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook — raw body must be used (mounted separately in index.js)
async function stripeWebhookHandler(req, res) {
  const stripe = getStripe();
  if (!stripe) return res.status(503).send("Stripe disabled");

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes("your_")) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Dev fallback when webhook secret not set
      event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      db.prepare(`
        UPDATE bookings SET
          status = 'paid',
          payment_provider = 'stripe',
          payment_id = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(session.id, bookingId);
      console.log("Booking marked paid:", bookingId);
    }
  }

  res.json({ received: true });
}

// PayPal create order
router.post("/paypal/create-order", async (req, res) => {
  try {
    if (!paypalEnabled()) {
      return res.status(503).json({
        error: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env",
      });
    }
    const { bookingId } = req.body || {};
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const { token, base } = await paypalAccessToken();
    // PayPal sandbox often uses USD; convert roughly for demo if needed
    let currency = "USD";
    let value = (booking.total_amount / 10).toFixed(2); // ~10 MAD = 1 USD demo rate
    if (process.env.PAYPAL_CURRENCY === "EUR") {
      currency = "EUR";
      value = (booking.total_amount / 10).toFixed(2);
    }

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: currency, value },
            description: booking.trip_title.slice(0, 120),
            custom_id: booking.id,
          },
        ],
        application_context: {
          brand_name: "excursionmarrakech",
          user_action: "PAY_NOW",
          return_url: `${process.env.SITE_URL || "http://localhost:3000"}/booking-success?bookingId=${booking.id}&provider=paypal`,
          cancel_url: `${process.env.SITE_URL || "http://localhost:3000"}/${encodeURIComponent(booking.trip_id)}?cancelled=1`,
        },
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) {
      console.error(order);
      return res.status(502).json({ error: "PayPal order failed", details: order });
    }

    db.prepare(`
      UPDATE bookings SET
        status = 'pending_payment',
        payment_provider = 'paypal',
        payment_id = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(order.id, booking.id);

    const approve = (order.links || []).find((l) => l.rel === "approve");
    res.json({ orderId: order.id, approveUrl: approve?.href });
  } catch (err) {
    console.error("PayPal create error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PayPal capture
router.post("/paypal/capture", async (req, res) => {
  try {
    if (!paypalEnabled()) return res.status(503).json({ error: "PayPal not configured" });
    const { orderId, bookingId } = req.body || {};
    const { token, base } = await paypalAccessToken();
    const capRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const captured = await capRes.json();
    if (!capRes.ok) {
      return res.status(502).json({ error: "Capture failed", details: captured });
    }

    const id = bookingId || captured.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
    const booking =
      db.prepare("SELECT * FROM bookings WHERE id = ? OR payment_id = ?").get(id, orderId) ||
      db.prepare("SELECT * FROM bookings WHERE payment_id = ?").get(orderId);

    if (booking) {
      db.prepare(`
        UPDATE bookings SET
          status = 'paid',
          payment_provider = 'paypal',
          payment_id = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(orderId, booking.id);
    }

    res.json({ ok: true, status: captured.status, bookingId: booking?.id });
  } catch (err) {
    console.error("PayPal capture error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Confirm payment manually after Stripe redirect (when webhooks unavailable in local dev)
router.post("/confirm-session", async (req, res) => {
  try {
    const { bookingId, provider } = req.body || {};
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status === "paid") {
      return res.json({ status: "paid", bookingId });
    }

    if (provider === "stripe" && stripeEnabled() && booking.payment_id) {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(booking.payment_id);
      if (session.payment_status === "paid") {
        db.prepare(`
          UPDATE bookings SET status = 'paid', updated_at = datetime('now') WHERE id = ?
        `).run(booking.id);
        return res.json({ status: "paid", bookingId: booking.id });
      }
    }

    res.json({ status: booking.status, bookingId: booking.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, stripeWebhookHandler, stripeEnabled, paypalEnabled };
