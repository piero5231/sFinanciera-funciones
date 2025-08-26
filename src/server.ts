import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
});
