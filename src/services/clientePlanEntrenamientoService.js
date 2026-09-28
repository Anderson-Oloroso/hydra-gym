import { connection } from "../config/database.js";

export class ClientePlanEntrenamientoService {

    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                cp.id_cliente_plan,
                cp.id_cliente,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                cp.id_plan,
                p.nombre_plan AS plan,
                p.duracion_dias,
                cp.fecha_inicio,
                cp.fecha_fin,
                cp.estado,
                cp.fecha_asigncion
            FROM cliente_plan_entrenamiento cp
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            ORDER BY cp.id_cliente_plan ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const query = `
            SELECT 
                cp.id_cliente_plan,
                cp.id_cliente,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                cp.id_plan,
                p.nombre_plan AS plan,
                p.duracion_dias,
                cp.fecha_inicio,
                cp.fecha_fin,
                cp.estado,
                cp.fecha_asigncion
            FROM cliente_plan_entrenamiento cp
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            WHERE cp.id_cliente_plan = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async getClientById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows;
    }

    static async getByIdPlan(id) {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT p.*, n.nombre AS nivel 
            FROM plan_entrenamiento p 
            LEFT JOIN nivel_entrenamiento n ON p.id_nivel = n.id_nivel 
            WHERE p.id_plan = ?
        `, [id]);
        return rows;
    }

    static async create(newPlan){
        const db = await connection();
        const query = 'INSERT INTO cliente_plan_entrenamiento (id_cliente, id_plan, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            newPlan.id_cliente,
            newPlan.id_plan,
            newPlan.fecha_inicio,
            newPlan.fecha_fin,
            newPlan.estado
        ]);
        return result;
    }

    static async update(id, updatedPlan) {
        const db = await connection();
        const query = 'UPDATE cliente_plan_entrenamiento SET fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id_cliente_plan = ?';
        const [ result ] = await db.execute(query, [
            updatedPlan.fecha_inicio,
            updatedPlan.fecha_fin,
            updatedPlan.estado,
            id
        ]);
        return result;
    }

    static async delete(id){
        const db = await connection();
        const query = 'DELETE FROM cliente_plan_entrenamiento WHERE id_cliente = ?';
        const [ result ] = await db.execute(query,[id]);
        return result;
    }
}
