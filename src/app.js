import * as readline from 'readline/promises';
import { mainMenu, submenu } from './utils/menu.js';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main(){
    let opc = '1';
    while(true){
        await mainMenu(rl);
    opc = await rl.question('--> Elije una opción: ');
    switch(opc){
        case '1':
            await submenu('Clientes');
            break;
        case '2':
            await submenu('Planes de entrenamiento');
            break;
        case '3':
            await submenu('Gestion Financiera');
            break;
        case '4':
            await submenu('Categorias Financieras');
            break;
        case '5':
            await submenu('Planes de nutricion');
            break;
        case '6':
            await submenu('Detalles de Comida Diaria');
            break;
        case '7':
            await submenu('Seguimiento Fisico');
            break;
        case '8':
            await submenu('Cliente - Plan de entrenamiento');
            break;
        case '0':
            console.log(chalk.green.bold('Saliendo del programa ...'));
            rl.close();
            return;
        default:
            console.error(chalk.red.bold(`${opc} no es una opción válida`));
            break;
        }
    }
}

main();