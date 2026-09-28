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
}
