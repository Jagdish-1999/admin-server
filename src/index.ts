import dotenv from "dotenv";
import { app } from "./app";
import { connectToDB } from "./db";

dotenv.config({ path: "./.env.local" });

const port = process.env.PORT;

connectToDB().then(() => {
  app.on("Error", (error) => {
    console.log("[Error]: Express is not communicating with MongoDB", error);
    throw error;
  });
  app.listen(port, () => {
    console.log(
      `[Server]: Server is running at port - http://localhost:${port}`
    );
  });
});
