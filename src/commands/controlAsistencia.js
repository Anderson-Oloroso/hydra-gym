import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ControlAsistenciaService } from "../services/controlAsistenciaService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de control de asistencias: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");

    return `${dia}-${mes}-${año} ${horas}:${minutos}`;
}

export async function listAsistencias(){
    try {
        const records = await ControlAsistenciaService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay asistencias registradas en el sistema.'));
            return;
        }

        console.table(records.map(r => ({
            'ID': r.id_asistencia,
            'Fecha y Hora': formatDate(r.fecha),
            'ID Cliente': r.id_cliente,
            'Cliente': r.cliente || 'N/A',
            'Plan': r.plan || 'N/A',
            'Tipo Sesión': r.tipo_sesion ? r.tipo_sesion.toUpperCase() : 'N/A',
            'Notas': r.notas || 'Sin notas'
        })));
    } catch (err) {
        problem(err);
    }
}

export async function createAsistencia(){
    try{
        const { id_cliente } = await Enquirer.prompt({
            type: 'input',
            name: 'id_cliente',
            message: 'Ingrese el ID del cliente:',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const clientRows = await ControlAsistenciaService.getClientById(id_cliente.trim());
        if (!clientRows || clientRows.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún cliente con el ID: ${id_cliente}`));
            return;
        }

        const cliente = clientRows[0];
        if (!cliente.activo) {
            console.log(chalk.yellow(`No se puede registrar asistencia. El cliente ${cliente.nombre} ${cliente.apellido} se encuentra INACTIVO.`));
            return;
        }

        console.log(chalk.cyan(`Cliente seleccionado: ${cliente.nombre} ${cliente.apellido} (DPI: ${cliente.dpi})`));

        // Buscar planes activos y vigentes de este cliente
        const activePlans = await ControlAsistenciaService.getActivePlansByClientId(cliente.id_cliente);
        if (!activePlans || activePlans.length === 0) {
            console.log(chalk.yellow(`El cliente ${cliente.nombre} ${cliente.apellido} no tiene ningún plan de entrenamiento ACTIVO y vigente (o ya venció su suscripción).`));
            return;
        }

        let selectedClientPlanId;

        if (activePlans.length === 1) {
            selectedClientPlanId = activePlans[0].id_cliente_plan;
            console.log(chalk.cyan(`Plan activo detectado: ${activePlans[0].nombre_plan} (Vence: ${activePlans[0].fecha_fin})`));
        } else {
            const planPrompt = new Enquirer.Select({
                name: 'id_cliente_plan',
                message: 'Seleccione el plan de entrenamiento al que asiste:',
                choices: activePlans.map(p => ({
                    name: `${p.id_cliente_plan}`,
                    message: `ID Asignación ${p.id_cliente_plan} - ${p.nombre_plan} [Vence: ${p.fecha_fin}]`,
                    value: p.id_cliente_plan
                }))
            });
            const planChosen = await planPrompt.run();
            selectedClientPlanId = Number(planChosen);
        }

        const tipoSesionPrompt = new Enquirer.Select({
            name: 'tipo_sesion',
            message: 'Seleccione el tipo de sesión:',
            choices: [
                { name: 'individual', message: 'Individual (Entrenamiento 1 a 1 / Libre)', value: 'individual' },
                { name: 'grupal', message: 'Grupal (Clase grupal / Circuito)', value: 'grupal' }
            ]
        });
        const tipo_sesion = await tipoSesionPrompt.run();

        const { notas } = await Enquirer.prompt({
            type: 'input',
            name: 'notas',
            message: 'Notas adicionales u observaciones (opcional): '
        });

        const newAsistencia = EntityFactory.create('control_asistencia', {
            id_cliente: Number(cliente.id_cliente),
            id_cliente_plan: Number(selectedClientPlanId),
            tipo_sesion: tipo_sesion,
            notas: notas.trim() !== '' ? notas.trim() : null
        });

        const result = await ControlAsistenciaService.create(newAsistencia);
        console.log(chalk.green.bold(`Asistencia registrada exitosamente con ID: ${result.insertId}`));

    } catch (err) {
        problem(err);
    }
}