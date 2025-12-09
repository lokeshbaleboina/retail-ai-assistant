import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const INVENTORY = [
  { store: "Jubilee Hills", sku: "SAREE123", qty: 4, lat: 17.44, lng: 78.39 },
  { store: "Banjara Hills", sku: "SAREE123", qty: 2, lat: 17.41, lng: 78.44 },
  { store: "Hitech City", sku: "SHIRT999", qty: 6, lat: 17.45, lng: 78.38 }
];

app.post("/check", (req, res) => {
  const sku = req.body.sku;

  const available = INVENTORY.filter(item => item.sku === sku);

  res.json({
    message: "Store availability:",
    stores: available
  });
});

app.listen(5002, () => console.log("Inventory service on 5002"));
