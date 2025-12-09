import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory session store
const sessions = {};

// Create/get a session
function getSession(id) {
  if (!sessions[id]) {
    sessions[id] = {
      cart: [],
      messages: [],
      phone: null
    };
  }
  return sessions[id];
}

// Simple intent detection
function detectIntent(message) {
  const msg = message.toLowerCase();

  if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("pair"))
    return "recommend";

  if (msg.includes("stock") || msg.includes("available") || msg.includes("store"))
    return "inventory";

  if (msg.includes("buy") || msg.includes("payment") || msg.includes("price"))
    return "payment";

  return "smalltalk";
}

// MAIN CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  const { sessionId, message, phone } = req.body;

  const session = getSession(sessionId);

  // Optional phone number, stored for WhatsApp
  if (phone) {
    session.phone = phone;
  }

  // Store user message with timestamp
  session.messages.push({
    role: "user",
    content: message,
    timestamp: Date.now()
  });

  const intent = detectIntent(message);
  let result = {};

  try {
    // -------------------------
    // 1️⃣ Recommendation intent
    // -------------------------
    if (intent === "recommend") {
      const resp = await axios.post("http://localhost:5001/recommend", {
        cart: session.cart,
        message
      });

      // MVP cart auto-fill
      session.cart = ["SAREE123"];

      result = {
        type: "recommendation",
        message: resp.data.message,
        recommended: resp.data.recommended
      };
    }

    // -------------------------
    // 2️⃣ Inventory intent
    // -------------------------
    else if (intent === "inventory") {
      const resp = await axios.post("http://localhost:5002/check", {
        sku: "SAREE123",
        lat: 17.44,
        lng: 78.39
      });

      result = {
        type: "inventory",
        message: "Store availability:",
        stores: resp.data.stores || []
      };
    }

    // -------------------------
    // 3️⃣ Payment intent + WhatsApp push
    // -------------------------
    else if (intent === "payment") {
      const resp = await axios.post("http://localhost:5003/create", {
        amount: 1999,
        customerId: sessionId
      });

      const paymentLink = resp.data.link;

      // If customer provided a phone number → send WhatsApp template
      if (session.phone) {
        try {
          await axios.post("http://localhost:5004/send/template", {
            to: session.phone,
            template_name: "abfrl_payment_link",
            language: "en_US",
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: "Customer" },
                  { type: "text", text: `Order-${sessionId}` },
                  { type: "text", text: paymentLink }
                ]
              }
            ]
          });
        } catch (werr) {
          console.error("WhatsApp payment push failed:", werr?.response?.data || werr.message);
        }
      }

      result = {
        type: "payment",
        message: resp.data.message,
        link: paymentLink
      };
    }

    // -------------------------
    // 4️⃣ Smalltalk intent
    // -------------------------
    else {
      result = {
        type: "smalltalk",
        message:
          "Hi! I can help with recommendations, store availability, or creating payment links."
      };
    }

    return res.json(result);

  } catch (err) {
    console.error("Orchestrator error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Orchestrator service failed." });
  }
});


// --------------------------------------------------
// 5️⃣ List sessions → for abandoned-cart detection
// --------------------------------------------------
app.get("/sessions", (req, res) => {
  const list = Object.keys(sessions).map((id) => ({
    sessionId: id,
    cart: sessions[id].cart,
    phone: sessions[id].phone,
    messages: sessions[id].messages
  }));

  res.json({ sessions: list });
});


// Start server
app.listen(5000, () => console.log("Orchestrator running on port 5000"));
