import express from "express";
import handler from "./api/index.js";

const app = express();
// Mount the Vercel-style handler at root for local dev
app.use((req, res) => handler(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[login-ui] local dev listening on http://127.0.0.1:${PORT}`);
});
