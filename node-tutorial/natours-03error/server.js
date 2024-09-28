const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXPECTION! 🎇 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/natours-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("connection fail...");
});
db.once("open", () => {
  console.log("connection successful...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
