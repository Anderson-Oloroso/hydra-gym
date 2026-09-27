import { mainMenu, submenu, pause, clearScreen } from './utils/menu.js';
import { listClient, getById, getByName, createClient, updateClient, deleteClient} from './commands/clienteCmd.js';
import { listFinancialCat, createFinancialCat, updateFinancialCat, deleteFinancialCat } from './commands/categoriaFinancieraCmd.js';
import { closeConnection } from './config/database.js';
import chalk from 'chalk';

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
                                await getById();
                                break;

                            case 'Buscar registro por nombre':
                                await getByName();
                                break;
                            
                            case 'Listar registros':
                                await listClient();
                                break;

                            case 'Crear registros':
                                await createClient();
                                break;

                            case 'Actualizar registros':
                                await updateClient();
                                break;
                            
                            case 'Eliminar registros':
                                await deleteClient();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                        case 'CATEGORIAS FINANCIERAS':
                            switch(selectedAction){
                                case 'Listar registros':
                                    await listFinancialCat();
                                    break;

                                case 'Crear registros':
                                    await createFinancialCat();
                                    break;

                                case 'Actualizar registros':
                                    await updateFinancialCat();
                                    break;

                                case 'Eliminar registros':
                                    await deleteFinancialCat();
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