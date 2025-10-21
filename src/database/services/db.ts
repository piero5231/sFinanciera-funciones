import connection from "@/database/config/sequelizeClient";

let inited = false;

export const initializeDB = async () => {
  if (inited) return connection;

  if (!connection) throw new Error("Sequelize connection is undefined");

  try {
    await connection.authenticate();
    console.log("✅ Conexión a la DB establecida");

    //console.log("Modelos registrados:", Object.keys(connection.models));

    inited = true;
    return connection;
  } catch (err) {
    console.error("❌ Error al conectar con la BD:", err);
    throw err;
  }
};
