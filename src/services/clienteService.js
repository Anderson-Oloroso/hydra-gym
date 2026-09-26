import { connection } from "../config/database.js";
import chalk from "chalk";

export class ClientService{

    static async list(){
        const db = await connection();
        const [ rows ] = await db.query('SELECT * FROM clientes');
        return rows;
    }

    static async create(client){

    }

    static async getById(id){
        const db = await connection();
        const [ row ] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return row;
    }

    static async getByName(name){
        
    }

    static async update(){

    }
}