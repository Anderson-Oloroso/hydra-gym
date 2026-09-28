import chalk from "chalk";
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
