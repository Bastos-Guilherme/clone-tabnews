const { exec } = require("node:child_process");

function checkPostgres() {
  exec(
    "docker compose exec postgres-dev pg_isready --host localhost",
    handleReturn,
  );
}

function handleReturn(error, stdout) {
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".");
    checkPostgres();
    return;
  }
  console.log("\n🟢 Postgres aceitando conexoes!\n\n");
}

console.log("\n\n🔴 Aguardando postgres aceitar conexoes...");
checkPostgres;
