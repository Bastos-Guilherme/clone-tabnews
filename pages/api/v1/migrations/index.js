import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    let defaultMigrationRunnerOptions = {
      dbClient: dbClient,
      dryrun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(
        defaultMigrationRunnerOptions,
      );
      response.status(200).json(pendingMigrations);
    } else if (request.method === "POST") {
      defaultMigrationRunnerOptions.dryrun = false;
      const migratedMigrations = await migrationRunner(
        defaultMigrationRunnerOptions,
      );
      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      } else {
        response.status(200).json(migratedMigrations);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    dbClient.end();
  }
}
