import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ClientService } from "../services/clienteService.js";

function problem(err){
    console.log(chalk.red.bold(`Error al consultar clientes: ${err.message}`));
}

export async function listClient(){
    try {
        const clientes = await ClientService.list();
        if(!clientes || clientes.length === 0){
            console.log(chalk.yellow('No hay clientes registrados en el sistema.'));
            return;
        }

        console.table(clientes);
    } catch (err) {
        problem(err);
    }
}

export async function getById(id){
    try{
        const clienteObtenido = await ClientService.getById(id);
        if(!clienteObtenido || clienteObtenido.length === 0){
            console.log(chalk.yellow('La base de datos no encuentra ningún cliente con el id: ', id));
            return;
        }

        console.table(clienteObtenido);
    } catch (err) {
        problem(err);
    }
}