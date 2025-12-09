import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create", (req, res) => {
  const { amount, customerId } = req.body;

  return res.json({
    message: `Payment link for ₹${amount}`,
    link: `https://dummy-pay.com/pay/${customerId}-${amount}`
  });
});

app.listen(5003, () => console.log("Payment service on 5003"));
