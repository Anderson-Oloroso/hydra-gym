import { connection } from "../config/database.js";

export class ClientService {

    static async list() {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes');
        return rows;
    }

    static async getById(id) {
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows;
    }

    static async getByName(name) {
        const db = await connection();
        const search = `%${name.toLowerCase()}%`;
        const [ rows ] = await db.query('SELECT * FROM clientes WHERE LOWER(nombre) LIKE ? OR LOWER(apellido) LIKE ?',[search, search]);
        return rows;
    }

    static async create(client) {
        const db = await connection();
        const query = 'INSERT INTO clientes (dpi, nombre, apellido, correo) VALUES (?, ?, ?, ?)';
        const [ result ] = await db.execute(query, [
            client.dpi,
            client.nombre,
            client.apellido,
            client.correo
        ]);
        return result;
    }

    static async updateClient(id, updatedClient){
        const db = await connection();
        const query = 'UPDATE clientes SET dpi = ?, nombre = ?, apellido = ?, correo = ?, activo = ? WHERE id_cliente = ?';
        const [ result ] = await db.execute(query, [
            updatedClient.dpi,
            updatedClient.nombre,
            updatedClient.apellido,
            updatedClient.correo,
            updatedClient.activo,
            id
        ]);
        return result;
    }
}