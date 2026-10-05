import { connection } from "../config/database.js";

export class ControlAsistenciaService {
    static async getClientById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows;
    }

    static async getPlanById(id) {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT p.*, n.nombre AS nivel 
            FROM plan_entrenamiento p 
            LEFT JOIN nivel_entrenamiento n ON p.id_nivel = n.id_nivel 
            WHERE p.id_plan = ?
        `, [id]);
        return rows;
    }

    static async create(asistencia) {
        const db = await connection();
        const query = 'INSERT INTO asistencias (id_cliente, id_cliente_plan, id_plan_entrenamiento, tipo_sesion, notas) VALUES (?, ?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            asistencia.id_cliente,
            asistencia.id_cliente_plan,
            asistencia.id_plan_entrenamiento,
            asistencia.tipo_sesion,
            asistencia.notas
        ]);
        return result;
    }

    static async list() {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT ca.*, c.nombre AS nombre_cliente, p.nombre_plan AS nombre_plan 
            FROM asistencias ca
            LEFT JOIN clientes c ON ca.id_cliente = c.id_cliente
            LEFT JOIN plan_entrenamiento p ON ca.id_plan_entrenamiento = p.id_plan
        `);
        return rows;
    }
}