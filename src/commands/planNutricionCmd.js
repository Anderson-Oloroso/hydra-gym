import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { PlanNutricionService } from "../services/planNutricionService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de plan de nutrición: ${err.message || err}`));
}

function formatNutritionPlan(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            cliente: r.cliente ? r.cliente : 'N/A',
            plan_entrenamiento: r.plan_entrenamiento ? r.plan_entrenamiento : 'N/A',
            descripcion: r.descripcion ? r.descripcion : 'N/A'
        }));
    }

    return {
        ...records,
        cliente: records.cliente ? records.cliente : 'N/A',
        plan_entrenamiento: records.plan_entrenamiento ? records.plan_entrenamiento : 'N/A',
        descripcion: records.descripcion ? records.descripcion : 'N/A'
    };
}

export async function listNutritionPlan(){
    try {
        const records = await PlanNutricionService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay planes de nutrición registrados.'));
            return;
        }

        console.table(formatNutritionPlan(records));
    } catch (err) {
        problem(err);
    }
}

export async function createNutritionPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID de la asignación cliente - plan de entrenamiento: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsClientPlan = await PlanNutricionService.getClientPlanById(id);
        if (!existsClientPlan || existsClientPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ninguna asignación con el ID: ${id}`));
            return;
        }

        const clientPlan = existsClientPlan[0];
        if (clientPlan.estado !== 'activo') {
            console.log(chalk.yellow(`No se puede crear un plan de nutrición. La asignación con ID ${id} se encuentra en estado "${clientPlan.estado}" y debe estar "activo".`));
            return;
        }

        console.log(chalk.cyan(`Asignación seleccionada: Cliente: ${clientPlan.cliente} | Plan: ${clientPlan.plan} | Estado: ${clientPlan.estado}`));

        const { nombre } = await Enquirer.prompt({
            type: 'input',
            name: 'nombre',
            message: 'Nombre del plan de nutrición: ',
            validate(val) {
                return val.trim() !== '' ? true : 'El nombre del plan de nutrición no puede estar vacío.';
            }
        });

        const { descripcion } = await Enquirer.prompt({
            type: 'input',
            name: 'descripcion',
            message: 'Descripción del plan de nutrición (opcional, presione enter para omitir): '
        });

        const newNutritionPlan = EntityFactory.create('plan_nutricion', {
            id_cliente_plan: Number(id),
            nombre: nombre.trim(),
            descripcion: descripcion.trim() !== '' ? descripcion.trim() : null
        });

        const result = await PlanNutricionService.create(newNutritionPlan);
        console.log(chalk.green.bold(`Plan de nutrición creado exitosamente con ID: ${result.insertId}`));
    }
    catch(err){
        problem(err);
    }
}
