import { drizzle } from 'drizzle-orm/neon-http';
import {neon} from "@neondatabase/serverless"

import * as schema from "./schema"

const databaseurl = process.env.DATABASE_URL
if(!databaseurl){
    throw new Error("Database_url is not defined")
}

const sql = neon(databaseurl)

export const db = drizzle(sql, {schema})

export {sql}