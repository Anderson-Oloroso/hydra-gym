import { connection } from "../config/database.js";

export class PlanNutricionService {
    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                pn.id_plan_nutricion,
                pn.id_cliente_plan,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan_entrenamiento,
                cp.estado AS estado_plan,
                pn.nombre AS nombre_plan_nutricion,
                pn.descripcion
            FROM plan_nutricion pn
            LEFT JOIN cliente_plan_entrenamiento cp ON pn.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            ORDER BY pn.id_plan_nutricion ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const query = `
            SELECT 
                pn.id_plan_nutricion,
                pn.id_cliente_plan,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan_entrenamiento,
                cp.estado AS estado_plan,
                pn.nombre AS nombre_plan_nutricion,
                pn.descripcion
            FROM plan_nutricion pn
            LEFT JOIN cliente_plan_entrenamiento cp ON pn.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            WHERE pn.id_plan_nutricion = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async getClientPlanById(id) {
        const db = await connection();
        const query = `
            SELECT 
                cp.id_cliente_plan,
                cp.id_cliente,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                cp.id_plan,
                p.nombre_plan AS plan,
                cp.estado,
                cp.fecha_inicio,
                cp.fecha_fin
            FROM cliente_plan_entrenamiento cp
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            WHERE cp.id_cliente_plan = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async create(record) {
        const db = await connection();
        const query = 'INSERT INTO plan_nutricion (id_cliente_plan, nombre, descripcion) VALUES (?, ?, ?)';
        const [ result ] = await db.execute(query, [
            record.id_cliente_plan,
            record.nombre,
            record.descripcion
        ]);
        return result;
    }

    static async update(id, record) {
        const db = await connection();
        const query = 'UPDATE plan_nutricion SET nombre = ?, descripcion = ? WHERE id_plan_nutricion = ?';
        const [ result ] = await db.execute(query, [
            record.nombre,
            record.descripcion,
            id
        ]);
        return result;
    }
}
