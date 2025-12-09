import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", (req, res) => {
  console.log("WhatsApp message request:", req.body);

  return res.json({
    status: "mock-sent",
    sentTo: req.body.phone,
    template: req.body.template
  });
});

app.listen(5004, () => console.log("WhatsApp service on 5004"));
