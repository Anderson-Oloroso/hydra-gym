import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { PlanEntrenamientoService } from "../services/planEntrenamientoService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de planes de entrenamiento: ${err.message || err}`));
}

function formatWorkoutPlans(plans) {
    if (Array.isArray(plans)) {
        return plans.map(p => ({
            ...p,
            precio: typeof p.precio === 'number' ? p.precio.toFixed(2) : p.precio,
            activo: Boolean(p.activo)
        }));
    }

    return {
        ...plans,
        precio: typeof plans.precio === 'number' ? plans.precio.toFixed(2) : plans.precio,
        activo: Boolean(plans.activo)
    };
}

export async function listWorkoutPlan(){
    try {
        const workoutPlans = await PlanEntrenamientoService.list();
        if(!workoutPlans || workoutPlans.length === 0){
            console.log(chalk.yellow('No hay planes de entrenamiento registrados en el sistema.'));
            return;
        }

        console.table(formatWorkoutPlans(workoutPlans));
    } catch (err) {
        problem(err);
    }
}

export async function createWorkoutPlan(){
    try {
        const prompt = new Enquirer.Form({
            name: 'workoutPlan',
            message: 'Ingrese la información del plan de entrenamiento: ',
            choices:[
                { name: 'id_nivel', message: 'ID Nivel (ej. 1, 2, 3):', initial: '1'},
                { name: 'nombre_plan', message: 'Nombre del Plan:', initial: ''},
                { name: 'metas_fisicas', message: 'Metas Físicas / Objetivo:', initial: ''},
                { name: 'duracion_dias', message: 'Duración (en días):', initial: '30'},
                { name: 'precio', message: 'Precio:', initial: '0.00'}
            ]
        });

        const answers = await prompt.run();

        if (!answers.id_nivel.trim() || !answers.nombre_plan.trim() || !answers.duracion_dias.trim() || !answers.precio.trim()){
            console.log(chalk.red('Los campos ID Nivel, Nombre, Duración y Precio son obligatorios.'));
            return;
        }

        if (isNaN(answers.id_nivel) || isNaN(answers.duracion_dias) || isNaN(answers.precio)) {
            console.log(chalk.red('ID Nivel, Duración y Precio deben ser valores numéricos válidos.'));
            return;
        }

        const newWorkoutPlan = EntityFactory.create('plan_entrenamiento', {
            id_nivel: parseInt(answers.id_nivel.trim(), 10),
            nombre_plan: answers.nombre_plan.trim(),
            metas_fisicas: answers.metas_fisicas.trim(),
            duracion_dias: parseInt(answers.duracion_dias.trim(), 10),
            precio: parseFloat(answers.precio.trim()),
            activo: 1
        });

        const result = await PlanEntrenamientoService.create(newWorkoutPlan);
        console.log(chalk.green.bold(`Plan de entrenamiento creado exitosamente con ID: ${result.insertId}`));
    } catch (err) {
        problem(err);
    }
}

export async function updateWorkoutPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del plan a actualizar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsPlan = await PlanEntrenamientoService.getById(id);
        if (!existsPlan || existsPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún plan de entrenamiento con el ID: ${id}`));
            return;
        }

        const currentWorkoutPlan = existsPlan[0];
        console.log(chalk.cyan('Datos actuales del plan de entrenamiento ...'));
        console.table(formatWorkoutPlans([currentWorkoutPlan]));

        const prompt = new Enquirer.Form({
            name: 'workoutPlan',
            message: 'Modifique lo que sea necesario:',
            choices: [
                { name: 'id_nivel', message: 'ID Nivel:', initial: String(currentWorkoutPlan.id_nivel) },
                { name: 'nombre_plan', message: 'Nombre del Plan:', initial: currentWorkoutPlan.nombre_plan },
                { name: 'metas_fisicas', message: 'Metas Físicas:', initial: currentWorkoutPlan.metas_fisicas || '' },
                { name: 'duracion_dias', message: 'Duración (días):', initial: String(currentWorkoutPlan.duracion_dias) },
                { name: 'precio', message: 'Precio:', initial: String(currentWorkoutPlan.precio) }
            ]
        });

        const estadoPrompt = new Enquirer.Select({
            name: 'activo',
            message: 'Seleccione el estado activo:',
            choices: [
                { name: 'true', message: 'true', value: true },
                { name: 'false', message: 'false', value: false }
            ]
        });

        const answers = await prompt.run();
        const activoSelected = await estadoPrompt.run();

        if (isNaN(answers.id_nivel) || isNaN(answers.duracion_dias) || isNaN(answers.precio)) {
            console.log(chalk.red('ID Nivel, Duración y Precio deben ser valores numéricos válidos.'));
            return;
        }

        const updatedWorkoutPlan = EntityFactory.create('plan_entrenamiento', {
            id_nivel: parseInt(answers.id_nivel.trim(), 10),
            nombre_plan: answers.nombre_plan.trim(),
            metas_fisicas: answers.metas_fisicas.trim(),
            duracion_dias: parseInt(answers.duracion_dias.trim(), 10),
            precio: parseFloat(answers.precio.trim()),  
            activo: activoSelected === 'true' ? 1 : 0
        });
        
        await PlanEntrenamientoService.update(id, updatedWorkoutPlan);
        console.log(chalk.green.bold(`Plan de entrenamiento con ID ${id} actualizado correctamente.`));
    }
    catch(err){
        problem(err);
    }
}

export async function deleteWorkoutPlan(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del plan a eliminar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });
        const existsPlan = await PlanEntrenamientoService.getById(id);
        if (!existsPlan || existsPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún plan de entrenamiento con el ID: ${id}`));
            return;
        }
        const currentWorkoutPlan = existsPlan[0];
        console.log(chalk.cyan('Datos del plan de entrenamiento ...'));
        console.table(formatWorkoutPlans([currentWorkoutPlan]));

        const hasRelations = await PlanEntrenamientoService.hasRelations(id);
        if (hasRelations) {
            console.log(chalk.red.bold('\n[ INTEGRIDAD REFERENCIAL ]'));
            console.log(chalk.yellow(`No se puede eliminar el plan con ID ${id} porque tiene clientes o asignaciones asociadas en 'cliente_plan_entrenamiento'.`));
            console.log(chalk.gray('Para eliminar este plan, primero debe reasignar o eliminar las relaciones correspondientes.\n'));
            return;
        }
        const answer = await new Enquirer.Confirm({ 
            name: 'confirmacion', 
            message: '¿Confirmar eliminación?', 
            initial: false 
        }).run();
        if(answer){
            console.log(chalk.red(`Eliminando plan de entrenamiento con ID ${id} ...`));
            await PlanEntrenamientoService.delete(id);
            console.log(chalk.green.bold(`Plan de entrenamiento con ID ${id} eliminado exitosamente.`));
        }
        else{
            console.log(chalk.blue('Eliminación cancelada'));
        }
    }
    catch(err){
        problem(err);
    }
}
