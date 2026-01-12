test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch(
    "https://obscure-space-journey-q5p9vj7x4p72x7g7-3000.app.github.dev/api/v1/status",
  );
  expect(response.status).toBe(200);
});
