import { mainMenu, submenu, pause, clearScreen } from './utils/menu.js';
import { listClient, getById, getByName } from './commands/clienteCmd.js';
import { closeConnection } from './config/database.js';
import chalk from 'chalk';
import Enquirer from 'enquirer';

async function main(){
    while(true){
        try{
            clearScreen();
            const selectedEntity = await mainMenu();

            if(selectedEntity === 'SALIR'){
                console.log(chalk.green.bold('Saliendo del programa ...'));
                await closeConnection();
                process.exit(0);
            }

            while(true){
                clearScreen();
                const selectedAction = await submenu(selectedEntity);

                if(selectedAction === 'Regresar'){
                    break;
                }

                console.log(chalk.cyan.bold(`\nEjecutando: [${selectedAction}] en [${selectedEntity}]...\n`));

                switch (selectedEntity) {
                    case 'CLIENTES':
                        switch (selectedAction) {
                            case 'Buscar registro por id':
                                const id = await Enquirer.input({
                                    message: 'Ingresa el id a buscar: '
                                });
                                await getById(id);
                                break;

                            case 'Buscar registro por nombre':
                                const name = await Enquirer.input({
                                    message: 'Ingresa el nombre/apellido a buscar: '
                                });
                                await getByName(name);
                                break;
                            
                            case 'Listar registros':
                                await listClient();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;

                        }
                        break;

                    default:
                        console.log(chalk.yellow(`Entidad no implementada: ${selectedEntity}`));
                        break;
                }

                await pause();
            }
        }
        catch(err){
            if (err) {
                console.log(chalk.red('Error: '), err.message || err);
            }
            await closeConnection();
            process.exit(0);
        }
    }
}

main();