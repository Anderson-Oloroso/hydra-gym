import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

let dbConnection;

export async function connection() {
  try {
    if (dbConnection) {
      return dbConnection;
    }

    dbConnection = await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    console.log(chalk.green('The connection to MySQL was Successfull!'));

    return dbConnection;
  } catch (err) {
    console.log(chalk.red(`Error: ${err.message}`));
    throw err;
  }
}

export async function closeConnection() {
  if (dbConnection) {
    await dbConnection.end();
    dbConnection = null;
    console.log(chalk.yellow('Conection Closed'));
  }
}
