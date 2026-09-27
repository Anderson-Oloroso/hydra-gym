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
