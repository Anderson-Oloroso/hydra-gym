import { connection } from "../config/database.js";

export class ControlAsistenciaService {
    static async getClientById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows;
    }

    static async getActivePlansByClientId(idCliente) {
        const db = await connection();
        const query = `
            SELECT 
                cp.id_cliente_plan,
                cp.id_cliente,
                cp.id_plan,
                p.nombre_plan,
                cp.fecha_inicio,
                cp.fecha_fin,
                cp.estado
            FROM cliente_plan_entrenamiento cp
            JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            WHERE cp.id_cliente = ? AND cp.estado = 'activo' AND cp.fecha_fin >= CURDATE()
            ORDER BY cp.fecha_inicio DESC
        `;
        const [ rows ] = await db.query(query, [idCliente]);
        return rows;
    }

    static async create(asistencia) {
        const db = await connection();
        try {
            await db.beginTransaction();

            const queryVerificacion = `
                SELECT cp.id_cliente_plan, cp.estado, cp.fecha_fin, c.activo AS cliente_activo
                FROM cliente_plan_entrenamiento cp
                JOIN clientes c ON cp.id_cliente = c.id_cliente
                WHERE cp.id_cliente_plan = ? AND cp.id_cliente = ?
                FOR UPDATE
            `;
            const [ rows ] = await db.query(queryVerificacion, [asistencia.id_cliente_plan, asistencia.id_cliente]);

            if (!rows || rows.length === 0) {
                throw new Error(`Inconsistencia de datos: El plan seleccionado (ID: ${asistencia.id_cliente_plan}) no pertenece al cliente (ID: ${asistencia.id_cliente}).`);
            }

            if (!rows[0].cliente_activo) {
                throw new Error('El cliente se encuentra INACTIVO en el sistema.');
            }

            if (rows[0].estado !== 'activo') {
                throw new Error(`El plan del cliente está en estado '${rows[0].estado}' y no permite registrar asistencias.`);
            }

            const insertQuery = `
                INSERT INTO asistencias (id_cliente, id_cliente_plan, tipo_sesion, notas) 
                VALUES (?, ?, ?, ?)
            `;
            const [ result ] = await db.execute(insertQuery, [
                asistencia.id_cliente,
                asistencia.id_cliente_plan,
                asistencia.tipo_sesion,
                asistencia.notas || null
            ]);

            await db.commit();
            return result;
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }

    static async list() {
        const db = await connection();
        const query = `
            SELECT 
                a.id_asistencia,
                a.fecha,
                a.id_cliente,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                p.nombre_plan AS plan,
                a.tipo_sesion,
                a.notas
            FROM asistencias a
            LEFT JOIN clientes c ON a.id_cliente = c.id_cliente
            LEFT JOIN cliente_plan_entrenamiento cp ON a.id_cliente_plan = cp.id_cliente_plan
            LEFT JOIN plan_entrenamiento p ON cp.id_plan = p.id_plan
            ORDER BY a.fecha DESC
        `;
        const [ rows ] = await db.query(query);
        return rows;
    }
}