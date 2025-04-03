import { createApp } from "./app";

const PORT = 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
