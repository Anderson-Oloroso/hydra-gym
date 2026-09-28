import { connection } from "../config/database.js";

export class FinancialCatService{

    static async getById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM categoria_financiera WHERE id_categoria = ?', [id]);
        return rows;
    }

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

    static async update(id, updatedFinancialCat){
        const db = await connection();
        const query = 'UPDATE categoria_financiera SET nombre = ?, tipo = ?, descripcion = ? WHERE id_categoria = ?';
        const [ result ] = await db.execute(query, [
            updatedFinancialCat.nombre,        
            updatedFinancialCat.tipo,
            updatedFinancialCat.descripcion,
            id
        ]);
        return result;
    }  

    static async delete(id){
        const db = await connection();
        const query = 'DELETE FROM categoria_financiera WHERE id_categoria = ?';
        const [ row ] = await db.execute(query, [id]);
        return row;
    }
}
