import { connection } from "../config/database.js";

export class ContratoService {
    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                co.id_contrato,
                co.id_cliente_plan,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan,
                cp.estado AS estado_plan,
                co.condiciones,
                co.duracion_dias,
                co.precio,
                co.fecha_inicio,
                co.fecha_fin
            FROM contrato co
            LEFT JOIN cliente_plan_entrenamiento cp ON co.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            ORDER BY co.id_contrato ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const query = `
            SELECT 
                co.id_contrato,
                co.id_cliente_plan,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan,
                cp.estado AS estado_plan,
                co.condiciones,
                co.duracion_dias,
                co.precio,
                co.fecha_inicio,
                co.fecha_fin
            FROM contrato co
            LEFT JOIN cliente_plan_entrenamiento cp ON co.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            WHERE co.id_contrato = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async update(id, record) {
        const db = await connection();
        const query = 'UPDATE contrato SET condiciones = ?, precio = ? WHERE id_contrato = ?';
        const [ result ] = await db.execute(query, [
            record.condiciones,
            record.precio,
            id
        ]);
        return result;
    }
}
