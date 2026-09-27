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
