import { connection } from "../config/database.js";

export class FinancialCatService{
    static async list() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM categoria_financiera');
        return rows;
    }

    static async create(newFinancialCat){
        const db = await connection();
        const query = 'INSERT INTO categoria_financiera (nombre, tipo, descripcion) VALUES (?, ?, ?)';

        const [ result ] = await db.execute(query, [
            newFinancialCat.nombre,
            newFinancialCat.tipo,
            newFinancialCat.descripcion 
        ]);

        return result;
    }
}