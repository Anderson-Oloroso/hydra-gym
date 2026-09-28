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

    static async getById(id) {
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
            WHERE dc.id_comida = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async getNutritionPlanById(id) {
        const db = await connection();
        const query = `
            SELECT 
                pn.id_plan_nutricion,
                pn.id_cliente_plan,
                pn.nombre AS plan_nutricion,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                cp.estado AS estado_plan
            FROM plan_nutricion pn
            LEFT JOIN cliente_plan_entrenamiento cp ON pn.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN clientes c ON cp.id_cliente = c.id_cliente
            WHERE pn.id_plan_nutricion = ?
        `;
        const [ rows ] = await db.query(query, [id]);
        return rows;
    }

    static async getMealMoments() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM momento_comida ORDER BY id_momento ASC');
        return rows;
    }

    static async create(record) {
        const db = await connection();
        const query = 'INSERT INTO detalle_comida_diaria (id_plan_nutricion, id_momento, dia_semana, alimento, calorias_estimadas) VALUES (?, ?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            record.id_plan_nutricion,
            record.id_momento,
            record.dia_semana,
            record.alimento,
            record.calorias_estimadas
        ]);
        return result;
    }

    static async update(id, record) {
        const db = await connection();
        const query = 'UPDATE detalle_comida_diaria SET id_momento = ?, dia_semana = ?, alimento = ?, calorias_estimadas = ? WHERE id_comida = ?';
        const [ result ] = await db.execute(query, [
            record.id_momento,
            record.dia_semana,
            record.alimento,
            record.calorias_estimadas,
            id
        ]);
        return result;
    }
}
