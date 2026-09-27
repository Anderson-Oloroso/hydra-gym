import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { FinancialCatService } from '../services/categoriaFinancieraService.js';

function problem(err){
    console.log(chalk.red.bold(`Error en operación de categorias financieras: ${err.message || err}`));
}

export async function listFinancialCat(){
    try {
        const categories = await FinancialCatService.list();
        if(!categories || categories.length === 0){
            console.log(chalk.yellow('No hay tategorias financieras registrados en el sistema.'));
            return;
        }

        console.table(categories);
    } catch (err) {
        problem(err);
    }
}

export async function createFinancialCat(){
    try{

        const prompt = new Enquirer.Form({
            name: 'categoria_financiera',
            message: 'Ingrese la información de la categoría financiera:',
            choices: [
                { name: 'nombre', message: 'Nombre:', initial: '' },
                { name: 'tipo', message: 'Tipo (ingreso/egreso):', initial: '' },
                { name: 'descripcion', message: 'Descripción:', initial: '' }
            ]
        });
        const answers = await prompt.run();

        const newFinancialCat = EntityFactory.create('categoria_financiera',{
            nombre: answers.nombre.trim(),
            tipo: answers.tipo.trim(),
            descripcion: answers.descripcion.trim()
        });

        if(answers.tipo.toLowerCase() !== 'ingreso' && answers.tipo.toLowerCase() !== 'egreso'){
            console.log(chalk.red('En el tipo solo pueden ser ingresados uno de los dos valores: ingreso/egreso.'));
            return;
        }

        if(!answers.nombre.trim() || !answers.tipo.trim() || !answers.descripcion.trim()){
           console.log(chalk.red('Todos los campos son obligatorios'));
            return; 
        }

        const result = await FinancialCatService.create(newFinancialCat);
        console.log(chalk.green.bold(`Categoria financiera creada exitosamente con ID: ${result.insertId}`));
    }
    catch(err){
        problem(err);
    }
}