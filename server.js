const app = require("./src/app");
const config = require("./src/configs/config.mongodb");
const server = app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});
process.stdin.resume();
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit();
  });
});



