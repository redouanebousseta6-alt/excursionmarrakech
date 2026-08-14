/**
 * Booking email notifications (guest confirmation + admin alert)
 * Configure SMTP_* in .env — if missing, emails are skipped with a log line.
 */
const nodemailer = require("nodemailer");

const SITE = (process.env.SITE_URL || "https://excursionmarrakech.net").replace(/\/$/, "");
const FROM =
  process.env.SMTP_FROM ||
  process.env.BOOKINGS_FROM ||
  `"excursionmarrakech" <${process.env.SMTP_USER || "noreply@excursionmarrakech.net"}>`;
const ADMIN_TO =
  process.env.BOOKINGS_NOTIFY_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "silversandstravels@gmail.com";

let transporter = null;

function isConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!isConfigured()) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(booking) {
  let text = `${Number(booking.total_amount).toLocaleString("fr-MA")} MAD`;
  if (
    booking.display_currency &&
    booking.display_currency !== "MAD" &&
    booking.display_total != null
  ) {
    text += ` (≈ ${booking.display_total} ${booking.display_currency})`;
  }
  return text;
}

function bookingRowsHtml(booking) {
  return `
    <table style="border-collapse:collapse;width:100%;max-width:520px;font-family:Georgia,serif;font-size:15px;color:#1c1410">
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Reference</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.id)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Trip</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.trip_title)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Guest</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.full_name)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Email</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.email)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Phone</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.phone || "—")}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Date</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.travel_date)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Travelers</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(booking.travelers)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8dfd4"><strong>Price</strong></td><td style="padding:8px 0;border-bottom:1px solid #e8dfd4">${escapeHtml(formatMoney(booking))}</td></tr>
      <tr><td style="padding:8px 0"><strong>Status</strong></td><td style="padding:8px 0">${escapeHtml(booking.status)}</td></tr>
    </table>`;
}

function guestSubject(booking) {
  if (booking.status === "paid") return `Payment received — ${booking.id} · excursionmarrakech`;
  return `Inquiry received — ${booking.id} · excursionmarrakech`;
}

function guestHtml(booking) {
  const isPaid = booking.status === "paid";
  const intro = isPaid
    ? "Thank you — we received your payment. Our team will follow up with final trip details soon."
    : "Thank you — we received your booking inquiry. Our team will confirm availability and get back to you by email or WhatsApp.";
  return `
  <div style="font-family:Georgia,serif;color:#1c1410;line-height:1.5;max-width:560px">
    <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#c45c26;margin:0 0 8px">excursionmarrakech</p>
    <h1 style="font-size:22px;margin:0 0 12px">${isPaid ? "Payment received" : "Inquiry received"}</h1>
    <p style="margin:0 0 20px">${escapeHtml(intro)}</p>
    ${bookingRowsHtml(booking)}
    <p style="margin:24px 0 8px">WhatsApp / phone: <a href="https://wa.me/212639996960">+212 639 996 960</a></p>
    <p style="margin:0 0 20px"><a href="${SITE}/booking-success?bookingId=${encodeURIComponent(booking.id)}">View your booking summary</a></p>
    <p style="font-size:13px;color:#5c4a3d;margin:0">— The excursionmarrakech team</p>
  </div>`;
}

function adminSubject(booking) {
  return `New ${booking.status}: ${booking.id} · ${booking.trip_title}`;
}

function adminHtml(booking) {
  return `
  <div style="font-family:system-ui,sans-serif;color:#1c1410;line-height:1.5;max-width:560px">
    <h1 style="font-size:20px;margin:0 0 12px">New booking ${escapeHtml(booking.status)}</h1>
    <p style="margin:0 0 16px">A guest submitted a request on ${SITE}.</p>
    ${bookingRowsHtml(booking)}
    <p style="margin:20px 0 0"><a href="${SITE}/admin/">Open admin panel</a></p>
  </div>`;
}

async function sendMail({ to, subject, html, text }) {
  const tx = getTransporter();
  if (!tx) {
    console.warn("[mail] SMTP not configured — skipped:", subject, "→", to);
    return { skipped: true };
  }
  const info = await tx.sendMail({
    from: FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  });
  console.log("[mail] sent", subject, "→", to, info.messageId || "");
  return info;
}

/**
 * Send guest confirmation + admin notification for a booking row.
 * Never throws to the HTTP handler — failures are logged.
 */
async function notifyBookingCreated(booking) {
  try {
    await sendMail({
      to: booking.email,
      subject: guestSubject(booking),
      html: guestHtml(booking),
    });
  } catch (err) {
    console.error("[mail] guest email failed:", err.message);
  }
  try {
    await sendMail({
      to: ADMIN_TO,
      subject: adminSubject(booking),
      html: adminHtml(booking),
      text: `New ${booking.status} ${booking.id}\n${booking.trip_title}\n${booking.full_name}\n${booking.email}\n${booking.phone}\n${booking.travel_date}\n${booking.travelers} travelers\n${formatMoney(booking)}`,
    });
  } catch (err) {
    console.error("[mail] admin email failed:", err.message);
  }
}

module.exports = {
  isConfigured,
  notifyBookingCreated,
  sendMail,
};
