import chalk from "chalk";
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
