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

    static async getById(id) {
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
            WHERE sf.id_seguimiento = ?
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
        const query = `
            INSERT INTO seguimiento_fisico 
            (id_cliente_plan, semana, fecha_registro, peso_kg, grasa_corporal, altura_cm, fotos, comentarios) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [ result ] = await db.execute(query, [
            record.id_cliente_plan,
            record.semana,
            record.fecha_registro,
            record.peso_kg,
            record.grasa_corporal,
            record.altura_cm,
            record.fotos,
            record.comentarios
        ]);
        return result;
    }

    static async update(id, record) {
        const db = await connection();
        const query = `
            UPDATE seguimiento_fisico 
            SET peso_kg = ?, grasa_corporal = ?, altura_cm = ?, fotos = ?, comentarios = ? 
            WHERE id_seguimiento = ?
        `;
        const [ result ] = await db.execute(query, [
            record.peso_kg,
            record.grasa_corporal,
            record.altura_cm,
            record.fotos,
            record.comentarios,
            id
        ]);
        return result;
    }

    static async delete(id) {
        const db = await connection();
        const query = 'DELETE FROM seguimiento_fisico WHERE id_seguimiento = ?';
        const [ row ] = await db.execute(query, [id]);
        return row;
    }
}
