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

    static async getById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows;
    }

    static async getByIdPlan(id) {
        const db = await connection();
        const [ rows ] = await db.query(`
            SELECT p.*, n.nombre AS nivel 
            FROM plan_entrenamiento p 
            LEFT JOIN nivel_entrenamiento n ON p.id_nivel = n.id_nivel 
            WHERE p.id_plan = ?
        `, [id]);
        return rows;
    }

    static async create(newPlan, planDetails){
        const db = await connection();
        try {
            await db.beginTransaction();

            const queryPlan = 'INSERT INTO cliente_plan_entrenamiento (id_cliente, id_plan, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)';
            const [ resultPlan ] = await db.execute(queryPlan, [
                newPlan.id_cliente,
                newPlan.id_plan,
                newPlan.fecha_inicio,
                newPlan.fecha_fin,
                newPlan.estado || 'activo'
            ]);

            const id_cliente_plan = resultPlan.insertId;

            const queryContrato = 'INSERT INTO contrato (id_cliente_plan, condiciones, duracion_dias, precio, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?)';
            const condiciones = 'Contrato de adhesión al plan de entrenamiento Hydra Gym. Cumplimiento obligatorio del reglamento interno.';
            
            await db.execute(queryContrato, [
                id_cliente_plan,
                condiciones,
                planDetails.duracion_dias,
                planDetails.precio,
                newPlan.fecha_inicio,
                newPlan.fecha_fin
            ]);

            await db.commit();
            return resultPlan;
        } catch (err) {
            await db.rollback();
            throw err;
        }
    }
}
