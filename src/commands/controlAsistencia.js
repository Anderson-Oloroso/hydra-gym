import Enquirer from "enquirer";
import chalk from "chalk";
import { ControlAsistenciaService } from "../services/controlAsistenciaService.js";

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

export async function listAsistencias(){
    try {
        const records = await ControlAsistenciaService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay contratos registrados.'));
            return;
        }

        console.table(records.map(r => ({
            ...r,
            fecha: formatDate(r.fecha),
            cliente: r.cliente ? r.cliente : 'N/A',
            plan: r.plan ? r.plan : 'N/A',
            tipo_sesion: r.tipo_sesion ? r.tipo_sesion : 'N/A',
            notas: r.notas ? r.notas : 'Sin notas'
        })));
    } catch (err) {
        problem(err);
    }
}

export async function createAsistencia(){
    try{
        const answers = await Enquirer.prompt([
            { type: 'input', name: 'id_cliente', message: 'Ingrese el ID del cliente:', validate: value => value ? true : 'El ID del cliente es obligatorio.'},
            { type: 'input', name: 'id_cliente_plan', message: 'Ingrese el ID del plan del cliente:', validate: value => value ? true : 'El ID del plan del cliente es obligatorio.'},
            { type: 'input', name: 'id_plan_entrenamiento', message: 'Ingrese el ID del plan de entrenamiento:', validate: value => value ? true : 'El ID del plan de entrenamiento es obligatorio.'},
            { type: 'input', name: 'tipo_sesion', message: 'Ingrese el tipo de sesión (presencial/virtual):', validate: value => value ? true : 'El tipo de sesión es obligatorio.'},
            { type: 'input', name: 'notas', message: 'Ingrese notas adicionales (opcional):'}
        ]);
        
        if(!answers.id_cliente || !answers.id_cliente_plan || !answers.id_plan_entrenamiento || !answers.tipo_sesion){
            console.log(chalk.red('Todos los campos obligatorios deben ser completados.'));
            return;
        }

        if(!['individual', 'grupal'].includes(answers.tipo_sesion.toLowerCase())){
            console.log(chalk.red('El tipo de sesión debe ser "individual" o "grupal".'));
            return;
        }

        const client = await ControlAsistenciaService.getClientById(answers.id_cliente);
        if(!client || client.length === 0){
            console.log(chalk.red(`No se encontró un cliente con ID ${answers.id_cliente}.`));
            return;
        }
        
        const plan = await ControlAsistenciaService.getPlanById(answers.id_plan_entrenamiento);
        if(!plan || plan.length === 0){
            console.log(chalk.red(`No se encontró un plan de entrenamiento con ID ${answers.id_plan_entrenamiento}.`));
            return;
        }

        const clientePlan = await ControlAsistenciaService.getClientPlanById(answers.id_cliente_plan);
        if(!clientePlan || clientePlan.length === 0){
            console.log(chalk.red(`No se encontró un plan del cliente con ID ${answers.id_cliente_plan}.`));
            return;
        }

        const asistencia = await ControlAsistenciaService.create(answers);
        console.log(chalk.green('Asistencia registrada exitosamente:'), asistencia);
    } catch (err) {
        problem(err);
    }
}