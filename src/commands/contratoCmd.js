import Enquirer from "enquirer";
import chalk from "chalk";
import { ContratoService } from "../services/contratoService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de contratos: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();

    return `${dia}-${mes}-${año}`;
}

function formatContracts(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            cliente: r.cliente ? r.cliente : 'N/A',
            plan: r.plan ? r.plan : 'N/A',
            condiciones: r.condiciones ? r.condiciones : 'Sin condiciones especiales',
            precio: r.precio !== null && r.precio !== undefined ? `Q${Number(r.precio).toFixed(2)}` : 'N/A',
            fecha_inicio: formatDate(r.fecha_inicio),
            fecha_fin: formatDate(r.fecha_fin)
        }));
    }

    return {
        ...records,
        cliente: records.cliente ? records.cliente : 'N/A',
        plan: records.plan ? records.plan : 'N/A',
        condiciones: records.condiciones ? records.condiciones : 'Sin condiciones especiales',
        precio: records.precio !== null && records.precio !== undefined ? `Q${Number(records.precio).toFixed(2)}` : 'N/A',
        fecha_inicio: formatDate(records.fecha_inicio),
        fecha_fin: formatDate(records.fecha_fin)
    };
}

export async function listContract(){
    try {
        const records = await ContratoService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay contratos registrados.'));
            return;
        }

        console.table(formatContracts(records));
    } catch (err) {
        problem(err);
    }
}

export async function updateContract(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del contrato a actualizar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await ContratoService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún contrato con el ID: ${id}`));
            return;
        }

        const current = existsRecord[0];
        console.log(chalk.cyan('Datos actuales del contrato:'));
        console.table(formatContracts([current]));

        const { condiciones } = await Enquirer.prompt({
            type: 'input',
            name: 'condiciones',
            message: 'Condiciones del contrato: ',
            initial: current.condiciones || ''
        });

        const { precio } = await Enquirer.prompt({
            type: 'input',
            name: 'precio',
            message: 'Precio del contrato (Q): ',
            initial: current.precio !== null && current.precio !== undefined ? String(Number(current.precio).toFixed(2)) : '0.00',
            validate(val) {
                return !isNaN(val) && Number(val) >= 0 ? true : 'Debe ingresar un precio numérico válido.';
            }
        });

        await ContratoService.update(id, {
            condiciones: condiciones.trim() !== '' ? condiciones.trim() : null,
            precio: parseFloat(precio)
        });

        console.log(chalk.green.bold(`Contrato con ID ${id} actualizado exitosamente.`));
    }
    catch(err){
        problem(err);
    }
}
