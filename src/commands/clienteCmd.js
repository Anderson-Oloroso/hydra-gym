import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ClientService } from "../services/clienteService.js";

export async function listClient(){
    try {
        const clientes = await ClientService.list();
        if(!clientes || clientes.length === 0){
            console.log(chalk.yellow('No hay clientes registrados en el sistema.'));
            return;
        }

        console.table(clientes);
    } catch (err) {
        console.log(chalk.red(`Error al consultar clientes: ${err.message}`));
    }
}