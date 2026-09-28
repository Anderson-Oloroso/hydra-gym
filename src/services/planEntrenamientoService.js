import { connection } from "../config/database.js";

export class PlanEntrenamientoService {

    static async list() {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT p.*, n.nombre AS nivel 
            FROM plan_entrenamiento p 
            LEFT JOIN nivel_entrenamiento n ON p.id_nivel = n.id_nivel
        `);
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT p.*, n.nombre AS nivel 
            FROM plan_entrenamiento p 
            LEFT JOIN nivel_entrenamiento n ON p.id_nivel = n.id_nivel 
            WHERE p.id_plan = ?
        `, [id]);
        return rows;
    }

    static async create(plan) {
        const db = await connection();
        const query = 'INSERT INTO plan_entrenamiento (id_nivel, nombre_plan, metas_fisicas, duracion_dias, precio, activo) VALUES (?, ?, ?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            plan.id_nivel,
            plan.nombre_plan,
            plan.metas_fisicas,
            plan.duracion_dias,
            plan.precio,
            plan.activo ?? 1
        ]);
        return result;
    }

    static async update(id, updatedPlan) {
        const db = await connection();
        const query = 'UPDATE plan_entrenamiento SET id_nivel = ?, nombre_plan = ?, metas_fisicas = ?, duracion_dias = ?, precio = ?, activo = ? WHERE id_plan = ?';
        const [ result ] = await db.execute(query, [
            updatedPlan.id_nivel,
            updatedPlan.nombre_plan,
            updatedPlan.metas_fisicas,
            updatedPlan.duracion_dias,
            updatedPlan.precio,
            updatedPlan.activo,
            id
        ]);
        return result;
    }

    static async hasRelations(id) {
        const db = await connection();
        const query = 'SELECT COUNT(*) AS total FROM cliente_plan_entrenamiento WHERE id_plan = ?';
        const [ rows ] = await db.query(query, [id]);
        return rows[0].total > 0;
    }

    static async delete(id) {
        const db = await connection();
        const query = 'DELETE FROM plan_entrenamiento WHERE id_plan = ?';
        const [ row ] = await db.execute(query, [id]);
        return row;
    }
    
    static async getLevels() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM nivel_entrenamiento');
        return rows;
    }
}

