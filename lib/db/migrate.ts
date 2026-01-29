import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("Database url not found in the .env file");
}

const databaseurl = process.env.DATABASE_URL;
if (!databaseurl) {
  throw new Error("Database_url is not defined");
}

async function runMigtaion() {
  try {
    const sql = neon(databaseurl);
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("All migration are successfully!");
  } catch (error) {
    console.log("Migration Failed ");
    process.exit(1);
  }
}

runMigtaion();
