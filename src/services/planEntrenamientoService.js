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
}
