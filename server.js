const app = require("./src/app");

const PORT = process.env.PORT || 5022;
const server = app.listen(5022, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});



