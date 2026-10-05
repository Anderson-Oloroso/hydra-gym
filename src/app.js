import { mainMenu, submenu, pause, clearScreen } from './utils/menu.js';
import { listFinancialRecord, createFinancialRecord, updateFinancialRecord, deleteFinancialRecord, showFinancialBalance } from './commands/gestionFinancieraCmd.js';
import { listFinancialCat, createFinancialCat, updateFinancialCat, deleteFinancialCat } from './commands/categoriaFinancieraCmd.js';
import { listClient, getById, getByName, createClient, updateClient, deleteClient } from './commands/clienteCmd.js';
import { listWorkoutPlan, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } from './commands/planEntrenamientoCmd.js';
import { listClientPlan, createClientPlan, updateClientPlan, deleteClientPlan } from './commands/clientePlanEntrenamientoCmd.js';
import { listNutritionPlan, createNutritionPlan, updateNutritionPlan, deleteNutritionPlan } from './commands/planNutricionCmd.js';
import { listPhysicalTracking, createPhysicalTracking, updatePhysicalTracking, deletePhysicalTracking } from './commands/seguimientoFisicoCmd.js';
import { listMealDetail, createMealDetail, updateMealDetail, deleteMealDetail } from './commands/detalleComidaCmd.js';
import { listAsistencias, createAsistencia } from './commands/controlAsistencia.js';
import { listContract, updateContract } from './commands/contratoCmd.js';
import { closeConnection } from './config/database.js';
import chalk from 'chalk';

process.on('uncaughtException', (err) => {
    if (err.code === 'ERR_USE_AFTER_CLOSE' || (err.message && err.message.includes('readline was closed'))) {
        process.exit(0);
    }
    console.error(err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    if (!reason || reason === '' || (reason.message && reason.message.includes('readline was closed'))) {
        process.exit(0);
    }
});

process.on('SIGINT', async () => {
    console.log(chalk.green.bold('\n\nSaliendo del programa...'));
    try {
        await closeConnection();
    } catch {}
    process.exit(0);
});

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

                    case 'PLANES DE ENTRENAMIENTO':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listWorkoutPlan();
                                break;

                            case 'Crear registros':
                                await createWorkoutPlan();
                                break;

                            case 'Actualizar registros':
                                await updateWorkoutPlan();
                                break;
                                
                            case 'Eliminar registros':
                                await deleteWorkoutPlan();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'GESTION FINANCIERA':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listFinancialRecord();
                                break;

                            case 'Crear registros':
                                await createFinancialRecord();
                                break;

                            case 'Actualizar registros':
                                await updateFinancialRecord();
                                break;

                            case 'Eliminar registros':
                                await deleteFinancialRecord();
                                break;

                            case 'Ver balance financiero (general y por categorías)':
                                await showFinancialBalance();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'CLIENTE - PLAN DE ENTRENAMIENTO':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listClientPlan();
                                break;

                            case 'Crear registros':
                                await createClientPlan();
                                break;

                            case 'Actualizar registros':
                                await updateClientPlan();
                                break;

                            case 'Eliminar registros':
                                await deleteClientPlan();
                                break;
                                
                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'PLANES DE NUTRICION':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listNutritionPlan();
                                break;

                            case 'Crear registros':
                                await createNutritionPlan();
                                break;

                            case 'Actualizar registros':
                                await updateNutritionPlan();
                                break;

                            case 'Eliminar registros':
                                await deleteNutritionPlan();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'SEGUIMIENTO FISICO':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listPhysicalTracking();
                                break;

                            case 'Crear registros':
                                await createPhysicalTracking();
                                break;

                            case 'Actualizar registros':
                                await updatePhysicalTracking();
                                break;

                            case 'Eliminar registros':
                                await deletePhysicalTracking();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'DETALLE DE COMIDA DIARIA':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listMealDetail();
                                break;

                            case 'Crear registros':
                                await createMealDetail();
                                break;

                            case 'Actualizar registros':
                                await updateMealDetail();
                                break;

                            case 'Eliminar registros':
                                await deleteMealDetail();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'CONTRATOS':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listContract();
                                break;

                            case 'Actualizar registros':
                                await updateContract();
                                break;

                            default:
                                console.log(chalk.yellow(`Acción no implementada: ${selectedAction}`));
                                break;
                        }
                        break;

                    case 'CONTROL ASISTENCIAS':
                        switch (selectedAction) {
                            case 'Listar registros':
                                await listAsistencias();
                                break;

                            case 'Crear registros':
                                await createAsistencia();
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
            if (err && err !== '' && err.message !== '') {
                console.log(chalk.red('Error: '), err.message || err);
            }
            try {
                await closeConnection();
            } catch {}
            process.exit(0);
        }
    }
}

main();