import { createDb } from "./db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 4000;

const db = createDb();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`Pizza creator API listening on http://localhost:${PORT}`);
});
