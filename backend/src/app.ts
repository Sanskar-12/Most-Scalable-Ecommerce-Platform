import express from "express";

const PORT = 4000;

const app = express();

app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});
