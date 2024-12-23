import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: 5432,
});

export default pool;
