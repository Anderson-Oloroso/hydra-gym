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
}
