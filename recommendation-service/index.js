import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// RULE-BASED MVP RECOMMENDER
app.post("/recommend", (req, res) => {
  const { message } = req.body;

  if (message.toLowerCase().includes("saree")) {
    return res.json({
      message: "This saree pairs beautifully with a blouse & jewelry set.",
      recommended: ["BLOUSE123", "JEWEL789"]
    });
  }

  if (message.toLowerCase().includes("shirt")) {
    return res.json({
      message: "We suggest pairing this shirt with trousers and a leather belt.",
      recommended: ["TROUSER345", "BELT567"]
    });
  }

  return res.json({
    message: "Try pairing this with matching accessories!",
    recommended: []
  });
});

app.listen(5001, () => console.log("Recommendation service on 5001"));
