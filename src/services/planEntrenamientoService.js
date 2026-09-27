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
}
