import chalk from "chalk";
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
