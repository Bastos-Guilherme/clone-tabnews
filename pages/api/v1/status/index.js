import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const rawDbVersion = await database.query("SHOW server_version;");
  const dbVersion = rawDbVersion.rows[0].server_version;

  const rawDbMaxConnections = await database.query("SHOW max_connections;");
  const dbMaxConnections = rawDbMaxConnections.rows[0].max_connections;

  const dbName = "local_db";
  const rawDbOpenedConnections = await database.query(
    `SELECT count(*)::int FROM pg_stat_activity WHERE datname='${dbName}';`,
  );
  const dbOpenedConnections = rawDbOpenedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(dbMaxConnections),
        opened_connections: dbOpenedConnections,
      },
    },
  });
}

export default status;
