import express from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import StatementTxn from "../models/StatementTxn.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const RULES = [
  [/swiggy|zomato|restaurant|cafe|food/i, "Food"],
  [/uber|ola|irctc|metro|fuel|petrol/i, "Travel"],
  [/amazon|flipkart|myntra|shopping/i, "Shopping"],
  [/netflix|spotify|prime|hotstar/i, "Subscriptions"],
  [/electricity|recharge|jio|airtel|rent|bill/i, "Bills"],
  [/salary|interest/i, "Income"],
];
const categorize = (text) => {
  const hit = RULES.find(([re]) => re.test(text));
  return hit ? hit[1] : "Other";
};

const toNumber = (v) => parseFloat(String(v ?? "").replace(/[,\s]/g, "")) || 0;

const parseDate = (s) => {
  const m = String(s).trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
  if (m) {
    const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    return new Date(year, Number(m[2]) - 1, Number(m[1]));
  }
  return new Date(s);
};

const pick = (row, regex) => {
  const key = Object.keys(row).find((h) => regex.test(h.trim()));
  return key ? row[key] : undefined;
};

// POST /statement/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const records = parse(req.file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
    });

    const docs = [];
    for (const r of records) {
      const date = parseDate(pick(r, /^date|txn date|value date/i) ?? "");
      const description = String(pick(r, /narration|description|particulars|remarks/i) ?? "");
      const debit = toNumber(pick(r, /withdrawal|debit/i));
      const credit = toNumber(pick(r, /deposit|credit/i));
      if (isNaN(date.getTime()) || (!debit && !credit)) continue;

      docs.push({
        date,
        description,
        amount: debit || credit,
        type: debit ? "debit" : "credit",
        category: categorize(description),
      });
    }

    if (docs.length === 0) {
      return res.status(400).json({ message: "No valid rows found in this CSV" });
    }

       // skip rows that are already stored (same date, description, amount, type)
    const keyOf = (d) =>
      `${new Date(d.date).toISOString().slice(0, 10)}|${d.description}|${d.amount}|${d.type}`;

    const times = docs.map((d) => d.date.getTime());
    const existing = await StatementTxn.find({
      date: {
        $gte: new Date(Math.min(...times)),
        $lte: new Date(Math.max(...times)),
      },
    }).select("date description amount type");

    const seen = new Set(existing.map(keyOf));
    const fresh = docs.filter((d) => !seen.has(keyOf(d)));

    if (fresh.length > 0) await StatementTxn.insertMany(fresh);

    res.json({ inserted: fresh.length, skipped: docs.length - fresh.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /statement
router.get("/", async (req, res) => {
  try {
    const txns = await StatementTxn.find().sort({ date: -1 }).limit(500);
    res.status(200).json(txns);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE /statement  (clears imported data so the demo can be reset)
router.delete("/", async (req, res) => {
  try {
    await StatementTxn.deleteMany({});
    res.json({ message: "Cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /statement/forecast
router.get("/forecast", async (req, res) => {
  try {
    const rows = await StatementTxn.aggregate([
      { $match: { type: "debit" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const history = rows.map((r) => ({ month: r._id, actual: Math.round(r.total) }));
    if (history.length < 3) return res.json({ history, forecast: [] });

    const ys = history.map((h) => h.actual);
    const xs = ys.map((_, i) => i);
    const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
    const mx = avg(xs);
    const my = avg(ys);
    const slope =
      xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) /
      xs.reduce((s, x) => s + (x - mx) ** 2, 0);
    const intercept = my - slope * mx;

    const [lastYear, lastMonth] = history[history.length - 1].month.split("-").map(Number);
    const forecast = [1, 2, 3].map((k) => {
      const d = new Date(lastYear, lastMonth - 1 + k, 1);
      return {
        month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        predicted: Math.max(0, Math.round(intercept + slope * (xs.length - 1 + k))),
      };
    });

    res.json({ history, forecast });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;