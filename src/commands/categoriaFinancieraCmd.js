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

export async function updateFinancialCat() {
    try {
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID de la categoría a buscar: ',
            validate(value) {
                return !isNaN(value) && value.trim() !== ''
                    ? true
                    : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsFinancialCat = await FinancialCatService.getById(id);

        if (!existsFinancialCat || existsFinancialCat.length === 0) {
            console.log(chalk.yellow(`No se encontró ninguna categoría con el ID: ${id}`));
            return;
        }

        const currentFinancialCat = existsFinancialCat[0];

        console.log(chalk.cyan('Datos actuales de la categoría...'));
        console.table([currentFinancialCat]);

        const prompt = new Enquirer.Form({
            name: 'categoria_financiera',
            message: 'Modifique lo que sea necesario:',
            choices: [
                { name: 'nombre', message: 'Nombre:', initial: currentFinancialCat.nombre },
                { name: 'descripcion', message: 'Descripción:', initial: currentFinancialCat.descripcion }
            ]
        });

        const tipoPrompt = new Enquirer.Select({
            name: 'tipo',
            message: 'Seleccione el tipo:',
            choices: [
                { name: 'ingreso', message: 'Ingreso', value: 'ingreso' },
                { name: 'egreso', message: 'Egreso', value: 'egreso' }
            ],
            initial: currentFinancialCat.tipo
        });

        const answers = await prompt.run();
        const tipoSelected = await tipoPrompt.run();

        const updatedFinancialCat = EntityFactory.create('categoria_financiera', {
            nombre: answers.nombre.trim(),
            tipo: tipoSelected,
            descripcion: answers.descripcion.trim()
        });

        await FinancialCatService.update(id, updatedFinancialCat);

        console.log(chalk.green.bold(`Categoría financiera con ID ${id} actualizada correctamente.`));
    } catch (err) {
        problem(err);
    }
}

export async function deleteFinancialCat() {
    try {
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID de la categoría a buscar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== ''
                    ? true
                    : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsCategory = await FinancialCatService.getById(id);

        if (!existsCategory || existsCategory.length === 0) {
            console.log(chalk.yellow(`No se encontró ninguna categoría con el ID: ${id}`));
            return;
        }

        console.log(chalk.cyan('Datos de la categoría financiera...'));
        console.table([existsCategory[0]]);

        const hasRelations = await FinancialCatService.hasRelations(id);
        if (hasRelations) {
            console.log(chalk.red.bold('\n[ INTEGRIDAD REFERENCIAL ]'));
            console.log(chalk.yellow(`No se puede eliminar la categoría con ID ${id} porque tiene movimientos o registros asociados en 'gestion_financiera'.`));
            console.log(chalk.gray('Para eliminar esta categoría, primero debe reasignar o eliminar los registros financieros correspondientes.\n'));
            return;
        }

        const answer = await new Enquirer.Confirm({
            name: 'confirmacion',
            message: '¿Confirmar eliminación?',
            initial: false
        }).run();

        if (answer) {
            console.log(chalk.red(`Eliminando categoría con ID ${id}...`));
            await FinancialCatService.delete(id);
            console.log(
                chalk.green('Categoría financiera eliminada correctamente.')
            )
        } else {
            console.log(chalk.blue('Eliminación cancelada.'));
        }
    } catch (err) {
        problem(err);
    }
}
