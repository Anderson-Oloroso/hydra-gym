import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { ClientePlanEntrenamientoService } from "../services/clientePlanEntrenamientoService.js";
import { ContratoService } from "../services/contratoService.js";
import { GestionFinancieraService } from "../services/gestionFinancieraService.js";

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

        const existsClient = await ClientePlanEntrenamientoService.getClientById(id);
        if (!existsClient || existsClient.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún cliente con el ID: ${id}`));
            return;
        }

        const cliente = existsClient[0];
        if (!cliente.activo) {
            console.log(chalk.yellow(`No se puede asignar un plan. El cliente ${cliente.nombre} ${cliente.apellido} se encuentra INACTIVO en el sistema.`));
            return;
        }

        console.log(chalk.cyan(`Cliente seleccionado: ${cliente.nombre} ${cliente.apellido}`));

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
        if (!plan.activo) {
            console.log(chalk.yellow(`No se puede asignar el plan "${plan.nombre_plan}" porque se encuentra INACTIVO en el catálogo.`));
            return;
        }

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

        const contratoData = {
            condiciones: 'Respetar las normas internas del gimnasio, cumplir con los horarios establecidos y hacer uso adecuado de las instalaciones y equipo.',
            duracion_dias: Number(plan.duracion_dias),
            precio: parseFloat(plan.precio),
            fecha_inicio: `${fecha_inicio.trim()} 00:00:00`,
            fecha_fin: `${fecha_fin} 23:59:59`
        };

        const financialData = {
            id_categoria: 1,
            id_cliente: Number(id),
            monto: parseFloat(plan.precio).toFixed(2),
            descripcion: `Pago por plan de entrenamiento: ${plan.nombre_plan} para el cliente ${cliente.nombre} ${cliente.apellido}`
        };

        const result = await ClientePlanEntrenamientoService.createSubscriptionTransaction(newClientPlan, contratoData, financialData);
        console.log(chalk.green.bold(`Asignación creada con ID: ${result.insertId}`));
        console.log(chalk.green.bold('Contrato y registro financiero creados atómicamente en transacción ACID'));
    }
    catch(err){
        problem(err);
    }
}

export async function updateClientPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID de la asignación a actualizar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await ClientePlanEntrenamientoService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ninguna asignación con el ID: ${id}`));
            return;
        }

        const currentAssignment = existsRecord[0];
        console.log(chalk.cyan('Datos actuales de la asignación ...'));
        console.table(formatClientPlans([currentAssignment]));

        const rawDate = currentAssignment.fecha_inicio ? new Date(currentAssignment.fecha_inicio) : new Date();
        const initialDate = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${String(rawDate.getDate()).padStart(2, '0')}`;

        const { fecha_inicio } = await Enquirer.prompt({
            type: 'input',
            name: 'fecha_inicio',
            message: 'Fecha de Inicio (YYYY-MM-DD): ',
            initial: initialDate,
            validate(val) {
                const d = new Date(val + 'T00:00:00');
                return !isNaN(d.getTime()) && val.trim() !== '' ? true : 'Debe ingresar una fecha válida en formato YYYY-MM-DD.';
            }
        });

        const estadoPrompt = new Enquirer.Select({
            name: 'estado',
            message: 'Seleccione el nuevo estado del plan:',
            choices: [
                { name: 'activo', message: 'activo', value: 'activo' },
                { name: 'pendiente', message: 'pendiente', value: 'pendiente' },
                { name: 'completado', message: 'completado', value: 'completado' },
                { name: 'cancelado', message: 'cancelado', value: 'cancelado' }
            ],
            initial: currentAssignment.estado || 'activo'
        });

        const estadoSeleccionado = await estadoPrompt.run();

        const startDate = new Date(fecha_inicio.trim() + 'T00:00:00');
        startDate.setDate(startDate.getDate() + Number(currentAssignment.duracion_dias));
        const yyyy = startDate.getFullYear();
        const mm = String(startDate.getMonth() + 1).padStart(2, '0');
        const dd = String(startDate.getDate()).padStart(2, '0');
        const fecha_fin = `${yyyy}-${mm}-${dd}`;

        console.log(chalk.cyan(`Fecha fin recalculada automáticamente (+${currentAssignment.duracion_dias} días): ${fecha_fin}`));

        await ClientePlanEntrenamientoService.update(id, {
            fecha_inicio: fecha_inicio.trim(),
            fecha_fin: fecha_fin,
            estado: estadoSeleccionado
        });

        console.log(chalk.green.bold(`Asignación con ID ${id} actualizada correctamente.`));
    }
    catch(err){
        problem(err);
    }
}

export async function deleteClientPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del cliente a buscar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });
        const records = await ClientePlanEntrenamientoService.list()
        const existsClient = await ClientePlanEntrenamientoService.getClientById(id);
        if (!existsClient || existsClient.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún cliente con el ID: ${id}`));
            return;
        }

        console.log(chalk.cyan('Datos del cliente y su plan de entrenmiento ...'));
        let findRecord = records.find(dt => dt.id_cliente === existsClient[0].id_cliente)
        console.table(formatClientPlans(findRecord));

        const answer = await new Enquirer.Confirm({
            name: 'confirmacion',
            message: '¿Confirmar eliminación?',
            initial: false
        }).run();

        if (answer) {
            console.log(chalk.red(`Eliminando registro con ID ${id} ...`));
            await ClientePlanEntrenamientoService.delete(id);
            console.log(chalk.green.bold(`Cliente - plan de entrenamiento con ID ${id} eliminado exitosamente.`));
        } else {
            console.log(chalk.blue('Eliminación cancelada'));
        }
    }
    catch(err){
        problem(err);
    }

}