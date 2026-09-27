import { connection } from "../config/database.js";

export class FinancialCatService{
    static async list() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM categoria_financiera');
        return rows;
    }
}