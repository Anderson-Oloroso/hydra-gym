import { connection } from "../config/database.js";
import chalk from "chalk";

export class ClientService{

    static async list(){
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes');
        return rows;
    }

    static async create(newClient){
        
    }

    static async getById(id){
        const db = await connection();
        const [ row ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return row;
    }

    static async getByName(name){
        const db = await connection();

        const search = `%${name.toLowerCase()}%`
        const [ row ] = await db.query('SELECT * FROM clientes WHERE LOWER(nombre) LIKE ? OR LOWER(apellido) LIKE ?', [search, search]);
        return row;
    }

    static async update(id, newClient){
    
    }
}