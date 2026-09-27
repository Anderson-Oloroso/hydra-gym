import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { FinancialCatService } from '../services/categoriaFinancieraService.js';

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