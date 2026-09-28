import chalk from "chalk";
import { DetalleComidaService } from "../services/detalleComidaService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de detalle de comida: ${err.message || err}`));
}

function formatMealDetail(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            plan_nutricion: r.plan_nutricion ? r.plan_nutricion : 'N/A',
            cliente: r.cliente ? r.cliente : 'N/A',
            momento: r.momento ? r.momento : 'N/A',
            calorias_estimadas: r.calorias_estimadas !== null && r.calorias_estimadas !== undefined ? `${r.calorias_estimadas} kcal` : 'N/A'
        }));
    }

    return {
        ...records,
        plan_nutricion: records.plan_nutricion ? records.plan_nutricion : 'N/A',
        cliente: records.cliente ? records.cliente : 'N/A',
        momento: records.momento ? records.momento : 'N/A',
        calorias_estimadas: records.calorias_estimadas !== null && records.calorias_estimadas !== undefined ? `${records.calorias_estimadas} kcal` : 'N/A'
    };
}

export async function listMealDetail(){
    try {
        const records = await DetalleComidaService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay detalles de comidas diarias registrados.'));
            return;
        }

        console.table(formatMealDetail(records));
    } catch (err) {
        problem(err);
    }
}
