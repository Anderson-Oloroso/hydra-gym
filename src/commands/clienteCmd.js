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
        ...clients,
        activo: Boolean(clients.activo),
        fecha_registro: formatDate(clients.fecha_registro)
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

export async function getById(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el id a buscar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
                
            }
        });

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

export async function getByName(){
    try{
        const { name } = await Enquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Ingresa el nombre/apellido a buscar: ',
            validate(val) {
                return val.trim().length > 0 ? true : 'El término de búsqueda no puede estar vacío.';
            }
        });

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

export async function createClient(){
    try {
        const prompt = new Enquirer.Form({
            name: 'cliente',
            message: 'Ingrese la información del cliente: ',
            choices:[
                { name: 'dpi', message: 'DPI (13 dígitos):', initial: ''},
                { name: 'nombre', message: 'Nombre:', initial: ''},
                { name: 'apellido', message: 'Apellido:', initial: ''},
                { name: 'correo', message: 'Correo:', initial: ''}
            ]
        });

        const answers = await prompt.run();

        const newClient = EntityFactory.create('clientes', {
            dpi: answers.dpi.trim(),
            nombre: answers.nombre.trim(),
            apellido: answers.apellido.trim(),
            correo: answers.correo.trim()
        });

        if (!newClient.esDPIValido()) {
            console.log(chalk.red('El DPI debe contener exactamente 13 caracteres.'));
            return;
        }

        const resultado = await ClientService.create(newClient);
        console.log(chalk.green.bold(`Cliente creado exitosamente con ID: ${resultado.insertId}`));
    } catch (err) {
        problem(err);
    }
}