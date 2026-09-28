import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
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

export async function createMealDetail(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del plan de nutrición: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsPlan = await DetalleComidaService.getNutritionPlanById(id);
        if (!existsPlan || existsPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún plan de nutrición con el ID: ${id}`));
            return;
        }

        const nutritionPlan = existsPlan[0];
        console.log(chalk.cyan(`Plan de nutrición seleccionado: ${nutritionPlan.plan_nutricion} | Cliente: ${nutritionPlan.cliente || 'N/A'}`));

        const momentos = await DetalleComidaService.getMealMoments();
        if (!momentos || momentos.length === 0) {
            console.log(chalk.red('No se encontraron momentos de comida registrados en la base de datos.'));
            return;
        }

        const momentoPrompt = new Enquirer.Select({
            name: 'momento',
            message: 'Seleccione el momento de la comida:',
            choices: momentos.map(m => ({
                name: `${m.id_momento}`,
                message: `${m.id_momento}. ${m.nombre}`,
                value: m.id_momento
            }))
        });

        const idMomento = await momentoPrompt.run();

        const diasSemana = [
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado',
            'domingo'
        ];

        const diaPrompt = new Enquirer.Select({
            name: 'dia_semana',
            message: 'Seleccione el día de la semana:',
            choices: diasSemana.map(d => ({
                name: d,
                message: d.charAt(0).toUpperCase() + d.slice(1),
                value: d
            }))
        });

        const dia_semana = await diaPrompt.run();

        const { alimento } = await Enquirer.prompt({
            type: 'input',
            name: 'alimento',
            message: 'Alimento / Comida: ',
            validate(val) {
                return val.trim() !== '' ? true : 'Debe ingresar el alimento.';
            }
        });

        const { calorias_estimadas } = await Enquirer.prompt({
            type: 'input',
            name: 'calorias_estimadas',
            message: 'Calorías estimadas (kcal opcional, presione enter para omitir): ',
            validate(val) {
                return val.trim() === '' || (!isNaN(val) && Number(val) >= 0) ? true : 'Debe ingresar un número válido de calorías o dejarlo vacío.';
            }
        });

        const newDetail = EntityFactory.create('detalle_comida', {
            id_plan_nutricion: Number(id),
            id_momento: Number(idMomento),
            dia_semana: dia_semana,
            alimento: alimento.trim(),
            calorias_estimadas: calorias_estimadas.trim() !== '' ? parseInt(calorias_estimadas) : null
        });

        const result = await DetalleComidaService.create(newDetail);
        console.log(chalk.green.bold(`Detalle de comida creado exitosamente con ID: ${result.insertId}`));
    }
    catch(err){
        problem(err);
    }
}
