import chalk from "chalk";
import { SeguimientoFisicoService } from "../services/seguimientoFisicoService.js";

function problem(err){
    console.log(chalk.red.bold(`Error en operación de seguimiento físico: ${err.message || err}`));
}

function formatDate(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();

    return `${dia}-${mes}-${año}`;
}

function formatPhysicalTracking(records) {
    if (Array.isArray(records)) {
        return records.map(r => ({
            ...r,
            cliente: r.cliente ? r.cliente : 'N/A',
            plan: r.plan ? r.plan : 'N/A',
            fecha_registro: formatDate(r.fecha_registro),
            peso_kg: r.peso_kg !== null && r.peso_kg !== undefined ? `${Number(r.peso_kg).toFixed(2)} kg` : 'N/A',
            grasa_corporal: r.grasa_corporal !== null && r.grasa_corporal !== undefined ? `${Number(r.grasa_corporal).toFixed(2)}%` : 'N/A',
            altura_cm: r.altura_cm !== null && r.altura_cm !== undefined ? `${Number(r.altura_cm).toFixed(2)} cm` : 'N/A'
        }));
    }

    return {
        ...records,
        cliente: records.cliente ? records.cliente : 'N/A',
        plan: records.plan ? records.plan : 'N/A',
        fecha_registro: formatDate(records.fecha_registro),
        peso_kg: records.peso_kg !== null && records.peso_kg !== undefined ? `${Number(records.peso_kg).toFixed(2)} kg` : 'N/A',
        grasa_corporal: records.grasa_corporal !== null && records.grasa_corporal !== undefined ? `${Number(records.grasa_corporal).toFixed(2)}%` : 'N/A',
        altura_cm: records.altura_cm !== null && records.altura_cm !== undefined ? `${Number(records.altura_cm).toFixed(2)} cm` : 'N/A'
    };
}

export async function listPhysicalTracking(){
    try {
        const records = await SeguimientoFisicoService.list();
        if(!records || records.length === 0){
            console.log(chalk.yellow('No hay registros de seguimiento físico.'));
            return;
        }

        console.table(formatPhysicalTracking(records));
    } catch (err) {
        problem(err);
    }
}
