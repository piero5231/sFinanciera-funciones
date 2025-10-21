import dotenv from "dotenv";
import app from "./app";
import { initializeDB } from "./database/services/db";
dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

const startServer = async () => {
  try {
    await initializeDB(); 

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

