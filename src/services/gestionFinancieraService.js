import { connection } from "../config/database.js";

export class GestionFinancieraService {

    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                g.id_gestion,
                g.id_categoria,
                c.nombre AS categoria,
                c.tipo,
                g.id_cliente,
                CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
                g.monto,
                g.fecha_transaccion,
                g.descripcion
            FROM gestion_financiera g
            LEFT JOIN categoria_financiera c ON g.id_categoria = c.id_categoria
            LEFT JOIN clientes cl ON g.id_cliente = cl.id_cliente
            ORDER BY g.id_gestion ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const query = `
            SELECT 
                g.id_gestion,
                g.id_categoria,
                c.nombre AS categoria,
                c.tipo,
                g.id_cliente,
                CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
                g.monto,
                g.fecha_transaccion,
                g.descripcion
            FROM gestion_financiera g
            LEFT JOIN categoria_financiera c ON g.id_categoria = c.id_categoria
            LEFT JOIN clientes cl ON g.id_cliente = cl.id_cliente
            WHERE g.id_gestion = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async create(record) {
        const db = await connection();
        const query = 'INSERT INTO gestion_financiera (id_categoria, id_cliente, monto, descripcion) VALUES (?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            record.id_categoria,
            record.id_cliente,
            record.monto,
            record.descripcion
        ]);
        return result;
    }

    static async update(id, record) {
        const db = await connection();
        const query = 'UPDATE gestion_financiera SET id_categoria = ?, id_cliente = ?, monto = ?, descripcion = ? WHERE id_gestion = ?';
        const [ result ] = await db.execute(query, [
            record.id_categoria,
            record.id_cliente,
            record.monto,
            record.descripcion,
            id
        ]);
        return result;
    }

    static async delete(id) {
        const db = await connection();
        const query = 'DELETE FROM gestion_financiera WHERE id_gestion = ?';
        const [ row ] = await db.execute(query, [id]);
        return row;
    }

    static async getCategories() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM categoria_financiera');
        return rows;
    }
}
