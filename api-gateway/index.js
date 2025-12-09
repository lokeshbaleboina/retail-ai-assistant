import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// Orchestrator route
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5000/chat", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).send("Error contacting orchestrator");
  }
});

// Inventory route
app.post("/inventory/check", async (req, res) => {
  const resp = await axios.post("http://localhost:5002/check", req.body);
  res.json(resp.data);
});

// Recommendation route
app.post("/recommend", async (req, res) => {
  const resp = await axios.post("http://localhost:5001/recommend", req.body);
  res.json(resp.data);
});

// Payment route
app.post("/payment/create", async (req, res) => {
  const resp = await axios.post("http://localhost:5003/create", req.body);
  res.json(resp.data);
});

// WhatsApp route
app.post("/whatsapp/send", async (req, res) => {
  const resp = await axios.post("http://localhost:5004/send", req.body);
  res.json(resp.data);
});

app.listen(3000, () => console.log("API Gateway running on port 3000"));
