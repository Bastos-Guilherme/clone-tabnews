import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationRunnerOptions = {
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
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  } else if (request.method === "POST") {
    defaultMigrationRunnerOptions.dryrun = false;
    const migratedMigrations = await migrationRunner(
      defaultMigrationRunnerOptions,
    );
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    } else {
      response.status(200).json(migratedMigrations);
    }
  } else {
    response.status(405).json({});
  }
}
