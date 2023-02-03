// DB Connection

const Mongoose = require("mongoose");

const db = Mongoose.connection;

db.once("open", () => {
  console.log("Database connection succeed");
});

Mongoose.set('strictQuery', true);

const connectDB = async () => {
  await Mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
  });
};

module.exports = {
  connectDB,
};
