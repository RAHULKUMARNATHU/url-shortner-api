process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION ! 💥 Shutting down....");
  console.log(err.name, ":", err.message);
  process.exit(1);
});

const app = require("./app");
const DB = require('./config/mongoose')


const port = process.env.PORT || 3000;


const server = app.listen(port , () => {
    console.log(`App Running on port ${port} ...`);
})



process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥 ");
  console.log(err.name, ":", err.message);
  /*close gracefully not abrupt the running server or pending request */
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});