import { connection } from "../config/database.js";

export class SeguimientoFisicoService {
    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                sf.id_seguimiento,
                sf.id_cliente_plan,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan,
                cp.estado AS estado_plan,
                sf.semana,
                sf.fecha_registro,
                sf.peso_kg,
                sf.grasa_corporal,
                sf.altura_cm,
                sf.fotos,
                sf.comentarios
            FROM seguimiento_fisico sf
            LEFT JOIN cliente_plan_entrenamiento cp ON sf.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            ORDER BY sf.id_seguimiento ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }
}
