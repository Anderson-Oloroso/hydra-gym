import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ClientePlanEntrenamientoService } from "../services/clientePlanEntrenamientoService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de cliente - plan de entrenamiento: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();

    return `${dia}-${mes}-${año}`;
}

function formatClientPlans(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            cliente: r.cliente ? r.cliente : 'N/A',
            plan: r.plan ? r.plan : 'N/A',
            fecha_inicio: formatDate(r.fecha_inicio),
            fecha_fin: formatDate(r.fecha_fin),
            fecha_asigncion: formatDate(r.fecha_asigncion)
        }));
    }

    return {
        ...records,
        cliente: records.cliente ? records.cliente : 'N/A',
        plan: records.plan ? records.plan : 'N/A',
        fecha_inicio: formatDate(records.fecha_inicio),
        fecha_fin: formatDate(records.fecha_fin),
        fecha_asigncion: formatDate(records.fecha_asigncion)
    };
}

export async function listClientPlan(){
    try {
        const records = await ClientePlanEntrenamientoService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay asignaciones de planes de entrenamiento a clientes registradas.'));
            return;
        }

        console.table(formatClientPlans(records));
    } catch (err) {
        problem(err);
    }
}

export async function createClientPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del cliente a buscar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsClient = await ClientePlanEntrenamientoService.getById(id);
        if (!existsClient || existsClient.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún cliente con el ID: ${id}`));
            return;
        }

        console.log(chalk.cyan(`Cliente seleccionado: ${existsClient[0].nombre} ${existsClient[0].apellido}`));

        const { idPlan } = await Enquirer.prompt({
            type: 'input',
            name: 'idPlan',
            message: 'Ingresa el ID del plan de entrenamiento a buscar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsPlan = await ClientePlanEntrenamientoService.getByIdPlan(idPlan);
        if (!existsPlan || existsPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún plan de entrenamiento con el ID: ${idPlan}`));
            return;
        }

        const plan = existsPlan[0];
        console.log(chalk.cyan(`Plan seleccionado: ${plan.nombre_plan} | Duración: ${plan.duracion_dias} días | Precio: Q${Number(plan.precio).toFixed(2)}`));

        const today = new Date();
        const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const { fecha_inicio } = await Enquirer.prompt({
            type: 'input',
            name: 'fecha_inicio',
            message: 'Fecha de Inicio (YYYY-MM-DD): ',
            initial: defaultDate,
            validate(val) {
                const d = new Date(val + 'T00:00:00');
                return !isNaN(d.getTime()) && val.trim() !== '' ? true : 'Debe ingresar una fecha válida en formato YYYY-MM-DD.';
            }
        });

        const startDate = new Date(fecha_inicio.trim() + 'T00:00:00');
        startDate.setDate(startDate.getDate() + Number(plan.duracion_dias));
        const yyyy = startDate.getFullYear();
        const mm = String(startDate.getMonth() + 1).padStart(2, '0');
        const dd = String(startDate.getDate()).padStart(2, '0');
        const fecha_fin = `${yyyy}-${mm}-${dd}`;

        console.log(chalk.cyan(`Fecha fin calculada automáticamente (+${plan.duracion_dias} días): ${fecha_fin}`));

        const newClientPlan = EntityFactory.create('cliente_plan_entrenamiento', {
            id_cliente: Number(id),
            id_plan: Number(idPlan),
            fecha_inicio: fecha_inicio.trim(),
            fecha_fin: fecha_fin,
            estado: 'activo'
        });

        const result = await ClientePlanEntrenamientoService.create(newClientPlan, plan);
        console.log(chalk.green.bold(`Asignación de plan y contrato creados exitosamente con ID: ${result.insertId}`));
    }
    catch(err){
        problem(err);
    }
}
