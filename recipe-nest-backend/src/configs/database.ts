import mongoose from "mongoose";
import { DB_URL } from './config';

mongoose.connect(DB_URL, { dbName: "recipe-nest" });

const database = mongoose.connection;

database.on("error", console.error.bind(console, "connection error: "));
database.once("open", () => {
  console.log("Database connected");
});

export default database;
