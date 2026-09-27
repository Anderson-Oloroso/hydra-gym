import chalk from "chalk";
import { GestionFinancieraService } from "../services/gestionFinancieraService.js";

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
