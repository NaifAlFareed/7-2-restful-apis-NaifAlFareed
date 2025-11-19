import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

// ✅ TODO 1 – connect to MongoDB with error handling
try {
  await connectDB(process.env.MONGO_URL);
  console.log("Mongo connected");
} catch (err) {
  console.error("Connection error:", err.message);
  process.exit(1);
}

// ✅ TODO 4 – GET all songs
app.get("/api/songs", async (_req, res) => {
  try {
    const rows = await Song.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message || "Load failed" });
  }
});

// ✅ GET single song (used by Edit)
app.get("/api/songs/:id", async (req, res) => {
  try {
    const s = await Song.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Song not found" });
    res.json(s);
  } catch (err) {
    res.status(400).json({ message: err.message || "Fetch failed" });
  }
});

// ✅ TODO 3 – POST /api/songs (create)
app.post("/api/songs", async (req, res) => {
  try {
    const { title = "", artist = "", year } = req.body || {};
    const created = await Song.create({
      title: title.trim(),
      artist: artist.trim(),
      year,
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message || "Create failed" });
  }
});

// ✅ TODO 5 – PUT /api/songs/:id (update)
app.put("/api/songs/:id", async (req, res) => {
  try {
    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      req.body || {},
      { new: true, runValidators: true, context: "query" }
    );
    if (!updated) return res.status(404).json({ message: "Song not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

// ✅ TODO 6 – DELETE /api/songs/:id (delete)
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Song not found" });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message || "Delete failed" });
  }
});

app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);
