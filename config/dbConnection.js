const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION);
    console.log(
      `Hi Irfana, Your Database is Connected : ${connect.connection.host}\nDatabase Name: ${connect.connection.name}`
    );
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDB;
