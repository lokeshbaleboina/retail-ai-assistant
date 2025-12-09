# 🛍️ Omnichannel Retail AI Sales Assistant  
### Agentic AI • Microservices Architecture • EY Techathon 6.0 Project

This project is an end-to-end prototype of a **Conversational AI Retail Sales Assistant** designed to operate seamlessly across **web, mobile app, WhatsApp, and in-store kiosks**.  
It delivers a unified, human-like shopping experience powered by an **Agentic AI Orchestrator** coordinating multiple worker microservices.

The solution mimics how a modern brand like ABFRL can improve **AOV, conversion rates, and omnichannel continuity** through conversational commerce and automation.

---

## 🚀 Features

### 🤖 **AI Sales Assistant**
- Understands user intent  
- Maintains context across channels  
- Provides natural retail-style guidance  

### 🎁 **Smart Recommendations**
- Suggests outfits, bundles, and accessories  
- Simple rule-based logic (LLM-ready)

### 🏬 **Store Inventory Intelligence**
- Fetches stock across locations  
- Identifies nearest store  
- Supports “Reserve In-Store for Try-On”

### 💳 **Payment Journey**
- Generates dummy payment links  
- Simulates payment confirmation flow

### 📱 **WhatsApp Automation**
- Abandoned-cart reminders  
- Payment follow-up  
- Post-purchase styling tips  

### 🔁 **Omnichannel Continuity**
Start on the web → continue on WhatsApp → finish in an in-store kiosk.

---

## 🧠 System Architecture

css
Copy code
                [ User Channels ]
Web | Mobile App | WhatsApp | In-Store Kiosk
│
▼
[ API Gateway ]
│
▼
[ AI Orchestrator ]
Intent Detection • Session Memory • Context Routing
┌─────────────┬──────────────┬──────────────┐
▼ ▼ ▼
[ Recommendation ] [ Inventory ] [ Payment Agent ]
│ │ │
└─────────────┴──────────────┘
▼
[ Aggregation & Response Builder ]
▼
[ WhatsApp Automation ]
▼
[ Reply Sent to User ]

yaml
Copy code

---

## 🧩 Microservices

| Service | Purpose | Port |
|--------|---------|------|
| API Gateway | Routing + CORS | 3000 |
| Orchestrator | Intent, context, agent coordination | 5000 |
| Recommendation Service | Basic rule engine | 5001 |
| Inventory Service | Mock stock + store mapping | 5002 |
| Payment Service | Dummy payment link API | 5003 |
| WhatsApp Service | Mocked WhatsApp Cloud API triggers | 5004 |
| Abandoned Cart Service | Detects idle users & triggers reminders | 5005 |
| Frontend (Next.js) | Chat interface | 3001 |

---

## 📁 Project Structure

retail-MVP/
│
├── api-gateway/
├── orchestrator-service/
├── recommendation-service/
├── inventory-service/
├── payment-service/
├── whatsapp-service/
├── abandoned-cart-service/
│
└── frontend/
├── pages/
├── components/
└── styles/

yaml
Copy code

---

## ▶️ Running the Project

### Install dependencies (repeat for each microservice)
npm install

shell
Copy code

### Start backend services
node index.js

shell
Copy code

### Start frontend
cd frontend
npm run dev

yaml
Copy code

Open the UI at:  
**http://localhost:3001**

---

## 🖼️ Wireframes (Included in PPT)

- Chat interface  
- Recommended products view  
- Inventory availability  
- Payment flow  
- WhatsApp confirmation  
- In-store kiosk view  

Add final wireframe images to:

/assets/wireframes/

yaml
Copy code

---

## 📊 Optional Visualizations

- Conversion lift after AI integration  
- Cart abandonment reduction  
- Channel usage distribution  
- Heatmap of popular product categories  

---

## 🧑‍💻 Author

**Lokesh Baleboina**  
ECE @ CBIT Hyderabad  
Full Stack Developer • AI/ML • Microservices • Conversational Commerce

---

## ⭐ Acknowledgement  
Built as a submission for **EY Techathon 6.0** demonstrating scalable, agentic AI for omnichannel retail.
