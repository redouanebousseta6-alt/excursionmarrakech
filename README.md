# excursionmarrakech

Premium Marrakech excursion storefront with **admin backend**, **Stripe + PayPal payments**, and **SEO / ads** readiness.

## Quick start

```bash
cp .env.example .env
npm install
npm run seed
npm start
```

Open:

- Store: http://localhost:3000
- Admin: http://localhost:3000/admin/
- Sitemap: http://localhost:3000/sitemap.xml

**Default admin** (from `.env`):

- Email: `admin@excursionmarrakech.com`
- Password: `Admin123!`

## What you get

| Feature | How |
|--------|-----|
| Public store | Home, trips archive, trip detail |
| Create / edit / deactivate excursions | Admin → Excursions |
| Manage bookings | Admin → Bookings (confirm / cancel) |
| Inquiry booking | “Request Booking” on trip page |
| Card payments | Stripe Checkout (when keys set) |
| PayPal | PayPal Orders API (when keys set) |
| Google SEO | `sitemap.xml`, `robots.txt`, semantic HTML, JSON-LD |
| Instagram / Meta ads | Set `META_PIXEL_ID` in `.env` + Privacy Policy |
| Google Ads | Set `GOOGLE_ADS_ID` in `.env` |

## Enable payments

### Stripe (cards)

1. Create account at https://dashboard.stripe.com  
2. Copy test **Secret** + **Publishable** keys into `.env`  
3. Restart server — “Pay with card” appears on trip pages  
4. For production webhooks: point Stripe to `https://YOUR_DOMAIN/api/payments/stripe/webhook`

> Note: some Stripe accounts don’t enable MAD in test mode. Set `STRIPE_CHARGE_CURRENCY=eur` in `.env` for sandbox demos (booking still stores MAD totals).

### PayPal

1. Create an app at https://developer.paypal.com/dashboard/  
2. Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE=sandbox`  
3. Restart — “Pay with PayPal” appears  

Sandbox uses an approximate MAD→USD conversion for checkout demos.

## Enable ads tracking

1. Add `META_PIXEL_ID` and/or `GOOGLE_ADS_ID` to `.env`  
2. Host on HTTPS with a real domain  
3. Verify domain in Meta Business / Google Ads  
4. Use Privacy Policy URL in ad account settings  

## Google indexing (production)

1. Deploy to a host (Railway, Render, VPS, etc.) with HTTPS  
2. Set `SITE_URL=https://your-domain.com` in `.env`  
3. Google Search Console → add property → submit `https://your-domain.com/sitemap.xml`  

## WordPress later?

This stack is self-contained (Node + SQLite). You can later:

- Keep this Node app as-is, or  
- Port trips into WordPress/WooCommerce and reuse the front-end design  

The admin panel already covers listing + booking management without WordPress.

## Scripts

- `npm start` — run server  
- `npm run dev` — run with `--watch`  
- `npm run seed` — (re)seed trips + admin  
- `npm run db:reset` — wipe DB and reseed  
