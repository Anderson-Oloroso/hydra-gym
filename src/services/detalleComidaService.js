import { connection } from "../config/database.js";

export class DetalleComidaService {
    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                dc.id_comida,
                dc.id_plan_nutricion,
                pn.nombre AS plan_nutricion,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                dc.id_momento,
                mc.nombre AS momento,
                dc.dia_semana,
                dc.alimento,
                dc.calorias_estimadas
            FROM detalle_comida_diaria dc
            LEFT JOIN plan_nutricion pn ON dc.id_plan_nutricion = pn.id_plan_nutricion
            LEFT JOIN cliente_plan_entrenamiento cp ON pn.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            LEFT JOIN momento_comida mc ON dc.id_momento = mc.id_momento
            ORDER BY dc.id_comida ASC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }
}
