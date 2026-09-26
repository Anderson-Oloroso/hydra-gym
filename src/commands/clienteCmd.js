import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ClientService } from "../services/clienteService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de clientes: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();

    return `${dia}-${mes}-${año}`;
}

function formatClients(clients) {
    if (Array.isArray(clients)) {
        return clients.map(c => ({
            ...c,
            activo: Boolean(c.activo),
            fecha_registro: formatDate(c.fecha_registro)
        }));
    }

    return {
        ...c,
        activo: Boolean(c.activo),
        fecha_registro: formatDate(c.fecha_registro)
    };
}

export async function listClient(){
    try {
        const clientes = await ClientService.list();
        if(!clientes || clientes.length === 0){
            console.log(chalk.yellow('No hay clientes registrados en el sistema.'));
            return;
        }

        console.table(formatClients(clientes));
    } catch (err) {
        problem(err);
    }
}

export async function getById(id){
    try{
        const clienteObtenido = await ClientService.getById(id);
        if(!clienteObtenido || clienteObtenido.length === 0){
            console.log(chalk.yellow(`La base de datos no encuentra ningún cliente con el id: ${id}`));
            return;
        }

        console.table(formatClients(clienteObtenido));
    } catch (err) {
        problem(err);
    }
}

export async function getByName(name){
    try{
        const clienteObtenido = await ClientService.getByName(name);
        if(!clienteObtenido || clienteObtenido.length === 0){
            console.log(chalk.yellow(`La base de datos no encuentra ningún cliente con el nombre/apellido: ${name}`));
            return;
        }

        console.table(formatClients(clienteObtenido));
    } catch (err) {
        problem(err);
    }
}
