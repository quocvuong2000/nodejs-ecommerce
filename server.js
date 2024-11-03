const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const server = app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});



