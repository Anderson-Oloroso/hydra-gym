import { mainMenu, submenu } from './utils/menu.js';
import chalk from 'chalk';

async function main(){
    while(true){
        try{
            console.clear();
            const selectedEntity = await mainMenu();

            if(selectedEntity === 'SALIR'){
                console.log(chalk.green.bold('Saliendo del programa ...'));
                return;
            }

            while(true){
                const selectedAction = await submenu(selectedEntity);

                if(selectedAction === 'Regresar'){
                    break;
                }

                console.log(chalk.cyan.bold(`Ejecutando: [${selectedAction}] en [${selectedEntity}]`));

                await new Promise((resolve) => setTimeout(resolve, 1500));
            }
        }
        catch(err){
            console.log('Error: ',err.message);
            break;
        }
    }
}

main();