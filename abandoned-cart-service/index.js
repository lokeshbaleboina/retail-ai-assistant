// abandoned-cart-service/index.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Config (override with environment variables)
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:5000";
const WHATSAPP_ENDPOINT = process.env.WHATSAPP_ENDPOINT || "http://localhost:5004/send/template";
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || "45000", 10); // default 45s
const ABANDON_THRESHOLD_MS = parseInt(process.env.ABANDON_THRESHOLD_MS || String(5 * 60 * 1000), 10); // default 5 min

// Memory of sessions we've already notified (so we don't spam)
const notifiedSessions = new Map();

/**
 * Check sessions from orchestrator and send WhatsApp reminders for abandoned carts.
 */
async function checkAbandonedCarts() {
  try {
    console.log("[abandoned-cart] fetching sessions from orchestrator...");

    const resp = await axios.get(`${ORCHESTRATOR_URL}/sessions`, { timeout: 5000 });
    const sessions = resp.data.sessions || [];

    const now = Date.now();

    for (const s of sessions) {
      const sessionId = s.sessionId;
      const cart = s.cart || [];
      const phone = s.phone || null;
      const messages = s.messages || [];

      if (!cart || cart.length === 0) {
        // If cart is empty and we had previously notified, clear the flag (customer acted)
        if (notifiedSessions.has(sessionId)) {
          notifiedSessions.delete(sessionId);
          console.log(`[abandoned-cart] cleared notified flag for ${sessionId} (cart empty)`);
        }
        continue;
      }

      // Determine last activity time
      const lastMsg = messages.length ? messages[messages.length - 1] : null;
      const lastTime = lastMsg?.timestamp || 0;
      const idleMs = now - lastTime;

      // Already notified? skip
      if (notifiedSessions.get(sessionId)) {
        // optionally you can re-notify after some cooldown; for MVP skip
        continue;
      }

      // If idle time exceeds threshold, and we have a phone, notify
      if (idleMs >= ABANDON_THRESHOLD_MS) {
        if (!phone) {
          console.log(`[abandoned-cart] session ${sessionId} has abandoned cart but no phone saved — skipping`);
          continue;
        }

        // Compose simple template params. You can adapt to real cart content.
        const customerName = "Customer";
        const productName = cart[0] || "your item"; // for MVP use first sku
        const storeName = "Nearest store";

        console.log(`[abandoned-cart] sending reminder for session ${sessionId} to ${phone} (idle ${Math.round(idleMs/1000)}s)`);

        try {
          const sendResp = await axios.post(WHATSAPP_ENDPOINT, {
            to: phone,
            template_name: process.env.CART_TEMPLATE_NAME || "abfrl_cart_reminder",
            language: "en_US",
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: customerName },
                  { type: "text", text: productName },
                  { type: "text", text: storeName }
                ]
              }
            ]
          }, { timeout: 8000 });

          console.log(`[abandoned-cart] whatsapp response for ${sessionId}:`, sendResp.data);
          // mark notified
          notifiedSessions.set(sessionId, { notifiedAt: now });
        } catch (err) {
          console.error(`[abandoned-cart] failed to send whatsapp for ${sessionId}:`, err?.response?.data || err.message);
        }
      }
    }
  } catch (err) {
    console.error("[abandoned-cart] error fetching sessions:", err?.response?.data || err.message);
  }
}

// Manual endpoint to trigger check (useful for testing)
app.get("/check", async (req, res) => {
  try {
    await checkAbandonedCarts();
    return res.json({ ok: true, notifiedCount: notifiedSessions.size });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Simple health endpoint
app.get("/health", (req, res) => res.json({ ok: true }));

// Start polling loop
setInterval(() => {
  checkAbandonedCarts().catch(e => console.error("Abandoned check failed:", e));
}, POLL_INTERVAL_MS);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`[abandoned-cart] running on ${PORT}`);
  console.log(`[abandoned-cart] ORCHESTRATOR_URL=${ORCHESTRATOR_URL}`);
  console.log(`[abandoned-cart] WHATSAPP_ENDPOINT=${WHATSAPP_ENDPOINT}`);
  console.log(`[abandoned-cart] POLL_INTERVAL_MS=${POLL_INTERVAL_MS}`);
  console.log(`[abandoned-cart] ABANDON_THRESHOLD_MS=${ABANDON_THRESHOLD_MS}`);
});
