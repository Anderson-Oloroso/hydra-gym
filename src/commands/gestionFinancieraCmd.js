import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
import { GestionFinancieraService } from "../services/gestionFinancieraService.js";
import { ClientService } from "../services/clienteService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de gestión financiera: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();

    return `${dia}-${mes}-${año}`;
}

function formatFinancialRecords(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            id_cliente: r.id_cliente !== null && r.id_cliente !== undefined ? r.id_cliente : 'N/A',
            monto: typeof r.monto === 'number' ? r.monto.toFixed(2) : r.monto,
            fecha_transaccion: formatDate(r.fecha_transaccion),
            cliente: r.cliente ? r.cliente : 'N/A'
        }));
    }

    return {
        ...records,
        id_cliente: records.id_cliente !== null && records.id_cliente !== undefined ? records.id_cliente : 'N/A',
        monto: typeof records.monto === 'number' ? records.monto.toFixed(2) : records.monto,
        fecha_transaccion: formatDate(records.fecha_transaccion),
        cliente: records.cliente ? records.cliente : 'N/A'
    };
}

export async function listFinancialRecord(){
    try {
        const records = await GestionFinancieraService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay registros de gestión financiera en el sistema.'));
            return;
        }

        console.table(formatFinancialRecords(records));
    } catch (err) {
        problem(err);
    }
}

export async function createFinancialRecord(){
    try {
        const categorias = await GestionFinancieraService.getCategories();
        if (!categorias || categorias.length === 0) {
            console.log(chalk.red('No se encontraron categorías financieras en la base de datos.'));
            return;
        }

        const categoriaPrompt = new Enquirer.Select({
            name: 'categoria',
            message: 'Seleccione la categoría financiera:',
            choices: categorias.map(c => ({
                name: `${c.id_categoria}`,
                message: `${c.id_categoria}. ${c.nombre} [${c.tipo.toUpperCase()}]`,
                value: c.id_categoria
            }))
        });

        const idCategoriaSeleccionada = await categoriaPrompt.run();
        const categoriaEncontrada = categorias.find(c => c.id_categoria === Number(idCategoriaSeleccionada));

        if (!categoriaEncontrada) {
            console.log(chalk.red('Categoría no válida.'));
            return;
        }

        const id_categoria = Number(categoriaEncontrada.id_categoria);
        let id_cliente = null;

        if (categoriaEncontrada.tipo === 'ingreso') {
            const clientes = await ClientService.list();
            if (!clientes || clientes.length === 0) {
                console.log(chalk.red('No hay clientes registrados en el sistema. Los ingresos requieren obligatoriamente un cliente.'));
                return;
            }

            const clientePrompt = new Enquirer.Select({
                name: 'cliente',
                message: 'Seleccione el cliente asociado al ingreso (obligatorio):',
                choices: clientes.map(c => ({
                    name: `${c.id_cliente}`,
                    message: `${c.id_cliente}. ${c.nombre} ${c.apellido} (DPI: ${c.dpi})`,
                    value: c.id_cliente
                }))
            });

            const idClienteSeleccionado = await clientePrompt.run();
            const clienteEncontrado = clientes.find(c => c.id_cliente === Number(idClienteSeleccionado));

            if (!clienteEncontrado) {
                console.log(chalk.red('Debe seleccionar un cliente válido para un ingreso.'));
                return;
            }

            id_cliente = Number(clienteEncontrado.id_cliente);
        } else {
            id_cliente = null;
        }

        const prompt = new Enquirer.Form({
            name: 'financialRecord',
            message: 'Ingrese los datos del movimiento financiero:',
            choices: [
                { name: 'monto', message: 'Monto:', initial: '0.00' },
                { name: 'descripcion', message: 'Descripción:', initial: '' }
            ]
        });

        const answers = await prompt.run();

        if (!answers.monto.trim() || !answers.descripcion.trim()) {
            console.log(chalk.red('Monto y Descripción son obligatorios.'));
            return;
        }

        if (isNaN(answers.monto) || parseFloat(answers.monto) <= 0) {
            console.log(chalk.red('El monto debe ser un valor numérico positivo mayor a cero.'));
            return;
        }

        const newFinancialRecord = EntityFactory.create('gestion_financiera', {
            id_categoria: id_categoria,
            id_cliente: id_cliente,
            monto: parseFloat(answers.monto.trim()),
            descripcion: answers.descripcion.trim()
        });

        const result = await GestionFinancieraService.create(newFinancialRecord);
        console.log(chalk.green.bold(`Registro financiero creado exitosamente con ID: ${result.insertId}`));
    } catch (err) {
        problem(err);
    }
}

export async function updateFinancialRecord(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del movimiento financiero a actualizar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await GestionFinancieraService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún registro financiero con el ID: ${id}`));
            return;
        }

        const currentFinancialRecord = existsRecord[0];
        console.log(chalk.cyan('Datos actuales del movimiento financiero ...'));
        console.table(formatFinancialRecords([currentFinancialRecord]));

        const categorias = await GestionFinancieraService.getCategories();
        if (!categorias || categorias.length === 0) {
            console.log(chalk.red('No se encontraron categorías financieras en la base de datos.'));
            return;
        }

        const categoriaActual = categorias.find(c => c.id_categoria === currentFinancialRecord.id_categoria);

        const categoriaPrompt = new Enquirer.Select({
            name: 'categoria',
            message: 'Seleccione la categoría financiera:',
            choices: categorias.map(c => ({
                name: `${c.id_categoria}`,
                message: `${c.id_categoria}. ${c.nombre} [${c.tipo.toUpperCase()}]`,
                value: c.id_categoria
            })),
            initial: categoriaActual ? `${categoriaActual.id_categoria}` : undefined
        });

        const idCategoriaSeleccionada = await categoriaPrompt.run();
        const categoriaEncontrada = categorias.find(c => c.id_categoria === Number(idCategoriaSeleccionada));

        if (!categoriaEncontrada) {
            console.log(chalk.red('Categoría no válida.'));
            return;
        }

        const id_categoria = Number(categoriaEncontrada.id_categoria);
        let id_cliente = null;

        if (categoriaEncontrada.tipo === 'ingreso') {
            const clientes = await ClientService.list();
            if (!clientes || clientes.length === 0) {
                console.log(chalk.red('No hay clientes registrados en el sistema. Los ingresos requieren obligatoriamente un cliente.'));
                return;
            }

            const clienteActual = clientes.find(c => c.id_cliente === currentFinancialRecord.id_cliente);

            const clientePrompt = new Enquirer.Select({
                name: 'cliente',
                message: 'Seleccione el cliente asociado al ingreso (obligatorio):',
                choices: clientes.map(c => ({
                    name: `${c.id_cliente}`,
                    message: `${c.id_cliente}. ${c.nombre} ${c.apellido} (DPI: ${c.dpi})`,
                    value: c.id_cliente
                })),
                initial: clienteActual ? `${clienteActual.id_cliente}` : undefined
            });

            const idClienteSeleccionado = await clientePrompt.run();
            const clienteEncontrado = clientes.find(c => c.id_cliente === Number(idClienteSeleccionado));

            if (!clienteEncontrado) {
                console.log(chalk.red('Debe seleccionar un cliente válido para un ingreso.'));
                return;
            }

            id_cliente = Number(clienteEncontrado.id_cliente);
        } else {
            id_cliente = null;
        }

        const prompt = new Enquirer.Form({
            name: 'financialRecord',
            message: 'Modifique lo que sea necesario:',
            choices: [
                { name: 'monto', message: 'Monto:', initial: String(currentFinancialRecord.monto) },
                { name: 'descripcion', message: 'Descripción:', initial: currentFinancialRecord.descripcion || '' }
            ]
        });

        const answers = await prompt.run();

        if (!answers.monto.trim() || !answers.descripcion.trim()) {
            console.log(chalk.red('Monto y Descripción son obligatorios.'));
            return;
        }

        if (isNaN(answers.monto) || parseFloat(answers.monto) <= 0) {
            console.log(chalk.red('El monto debe ser un valor numérico positivo mayor a cero.'));
            return;
        }

        const updatedFinancialRecord = EntityFactory.create('gestion_financiera', {
            id_categoria: id_categoria,
            id_cliente: id_cliente,
            monto: parseFloat(answers.monto.trim()),
            descripcion: answers.descripcion.trim()
        });

        await GestionFinancieraService.update(id, updatedFinancialRecord);
        console.log(chalk.green.bold(`Registro financiero con ID ${id} actualizado correctamente.`));
    }
    catch(err){
        problem(err);
    }
}

export async function deleteFinancialRecord(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del movimiento financiero a eliminar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await GestionFinancieraService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún registro financiero con el ID: ${id}`));
            return;
        }

        const currentFinancialRecord = existsRecord[0];
        console.log(chalk.cyan('Datos del movimiento financiero ...'));
        console.table(formatFinancialRecords([currentFinancialRecord]));

        const answer = await new Enquirer.Confirm({
            name: 'confirmacion',
            message: '¿Confirmar eliminación?',
            initial: false
        }).run();

        if (answer) {
            console.log(chalk.red(`Eliminando registro financiero con ID ${id} ...`));
            await GestionFinancieraService.delete(id);
            console.log(chalk.green.bold(`Registro financiero con ID ${id} eliminado exitosamente.`));
        } else {
            console.log(chalk.blue('Eliminación cancelada'));
        }
    } catch(err){
        problem(err);
    }
}

export async function showFinancialBalance(){
    try {
        const general = await GestionFinancieraService.getBalanceGeneral();
        const byCategory = await GestionFinancieraService.getBalancePorCategorias();

        console.log(chalk.cyan.bold('\n BALANCE FINANCIERO GENERAL \n'));
        const totalIngresos = Number(general?.total_ingresos || 0);
        const totalEgresos = Number(general?.total_egresos || 0);
        const balanceNeto = Number(general?.balance_neto || 0);

        console.table([
            {
                'Total Ingresos': `Q${totalIngresos.toFixed(2)}`,
                'Total Egresos': `Q${totalEgresos.toFixed(2)}`,
                'Balance Neto': balanceNeto >= 0 ? `+Q${balanceNeto.toFixed(2)}` : `-Q${Math.abs(balanceNeto).toFixed(2)}`
            }
        ]);

        const statusMsg = balanceNeto >= 0 
            ? chalk.green.bold(`Estado: SUPERÁVIT (+Q${balanceNeto.toFixed(2)})`)
            : chalk.red.bold(`Estado: DÉFICIT (-Q${Math.abs(balanceNeto).toFixed(2)})`);
        console.log(`\n${statusMsg}\n`);

        console.log(chalk.cyan.bold('==================== BALANCE POR CATEGORÍAS ===================='));
        if (!byCategory || byCategory.length === 0) {
            console.log(chalk.yellow('No hay movimientos registrados en las categorías.'));
            return;
        }

        const formattedCategories = byCategory.map(c => ({
            id_categoria: c.id_categoria,
            categoria: c.categoria,
            tipo: c.tipo.toUpperCase(),
            transacciones: c.total_transacciones,
            total_acumulado: `Q${Number(c.total_monto || 0).toFixed(2)}`
        }));

        console.table(formattedCategories);
    } catch (err) {
        problem(err);
    }
}
