import Enquirer from "enquirer";
import chalk from "chalk";
import { EntityFactory } from "../models/entityFactory.js";
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

        const data = formatPhysicalTracking(records);

        data.forEach((record, index) => {
            console.log(chalk.cyan(`\n ID: ${record.id_seguimiento}`));
            console.table(
                Object.entries(record).map(([campo, valor]) => ({
                    campo,
                    valor: valor ?? 'N/A'
                }))
            );
        });

    } catch (err) {
        problem(err);
    }
}

export async function createPhysicalTracking(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID de la asignación cliente - plan: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsClientPlan = await SeguimientoFisicoService.getClientPlanById(id);
        if (!existsClientPlan || existsClientPlan.length === 0) {
            console.log(chalk.yellow(`No se encontró ninguna asignación con el ID: ${id}`));
            return;
        }

        const clientPlan = existsClientPlan[0];
        if (clientPlan.estado !== 'activo') {
            console.log(chalk.yellow(`No se puede registrar seguimiento físico. La asignación con ID ${id} se encuentra en estado "${clientPlan.estado}" y debe estar "activo".`));
            return;
        }

        console.log(chalk.cyan(`Asignación seleccionada: Cliente: ${clientPlan.cliente} | Plan: ${clientPlan.plan} | Estado: ${clientPlan.estado}`));

        const { semana } = await Enquirer.prompt({
            type: 'input',
            name: 'semana',
            message: 'Semana de seguimiento: ',
            validate(val) {
                return !isNaN(val) && Number(val) > 0 ? true : 'Debe ingresar un número de semana válido (mayor a 0).';
            }
        });

        const today = new Date();
        const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const { fecha_registro } = await Enquirer.prompt({
            type: 'input',
            name: 'fecha_registro',
            message: 'Fecha de Registro (YYYY-MM-DD): ',
            initial: defaultDate,
            validate(val) {
                const d = new Date(val + 'T00:00:00');
                return !isNaN(d.getTime()) && val.trim() !== '' ? true : 'Debe ingresar una fecha válida en formato YYYY-MM-DD.';
            }
        });

        const { peso_kg } = await Enquirer.prompt({
            type: 'input',
            name: 'peso_kg',
            message: 'Peso en kg: ',
            validate(val) {
                return !isNaN(val) && Number(val) > 0 ? true : 'Debe ingresar un peso numérico válido (mayor a 0).';
            }
        });

        const { grasa_corporal } = await Enquirer.prompt({
            type: 'input',
            name: 'grasa_corporal',
            message: 'Porcentaje de grasa corporal (% opcional, presione enter para omitir): ',
            validate(val) {
                return val.trim() === '' || (!isNaN(val) && Number(val) >= 0) ? true : 'Debe ingresar un porcentaje válido o dejarlo vacío.';
            }
        });

        const { altura_cm } = await Enquirer.prompt({
            type: 'input',
            name: 'altura_cm',
            message: 'Altura en cm (opcional, presione enter para omitir): ',
            validate(val) {
                return val.trim() === '' || (!isNaN(val) && Number(val) > 0) ? true : 'Debe ingresar una altura válida o dejarlo vacío.';
            }
        });

        const { fotos } = await Enquirer.prompt({
            type: 'input',
            name: 'fotos',
            message: 'URL / Ruta de fotos (opcional, presione enter para omitir): '
        });

        const { comentarios } = await Enquirer.prompt({
            type: 'input',
            name: 'comentarios',
            message: 'Comentarios / observaciones (opcional, presione enter para omitir): '
        });

        const newTracking = EntityFactory.create('seguimiento_fisico', {
            id_cliente_plan: Number(id),
            semana: Number(semana),
            fecha_registro: fecha_registro.trim(),
            peso_kg: parseFloat(peso_kg),
            grasa_corporal: grasa_corporal.trim() !== '' ? parseFloat(grasa_corporal) : null,
            altura_cm: altura_cm.trim() !== '' ? parseFloat(altura_cm) : null,
            fotos: fotos.trim() !== '' ? fotos.trim() : null,
            comentarios: comentarios.trim() !== '' ? comentarios.trim() : null
        });

        const result = await SeguimientoFisicoService.create(newTracking);
        console.log(chalk.green.bold(`Seguimiento físico registrado exitosamente con ID: ${result.insertId}`));
    }
    catch(err){
        problem(err);
    }
}

export async function updatePhysicalTracking(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del registro de seguimiento a actualizar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await SeguimientoFisicoService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún registro de seguimiento con el ID: ${id}`));
            return;
        }

        const current = existsRecord[0];
        const formatted = formatPhysicalTracking(current);

        console.log(chalk.cyan(`\nDatos actuales del seguimiento físico (ID: ${current.id_seguimiento}):`));
        console.table(
            Object.entries(formatted).map(([campo, valor]) => ({
                campo,
                valor: valor ?? 'N/A'
            }))
        );

        const { peso_kg } = await Enquirer.prompt({
            type: 'input',
            name: 'peso_kg',
            message: 'Peso en kg: ',
            initial: current.peso_kg !== null && current.peso_kg !== undefined ? String(current.peso_kg) : '',
            validate(val) {
                return !isNaN(val) && Number(val) > 0 ? true : 'Debe ingresar un peso numérico válido (mayor a 0).';
            }
        });

        const { grasa_corporal } = await Enquirer.prompt({
            type: 'input',
            name: 'grasa_corporal',
            message: 'Porcentaje de grasa corporal (% opcional, presione enter para omitir): ',
            initial: current.grasa_corporal !== null && current.grasa_corporal !== undefined ? String(current.grasa_corporal) : '',
            validate(val) {
                return val.trim() === '' || (!isNaN(val) && Number(val) >= 0) ? true : 'Debe ingresar un porcentaje válido o dejarlo vacío.';
            }
        });

        const { altura_cm } = await Enquirer.prompt({
            type: 'input',
            name: 'altura_cm',
            message: 'Altura en cm (opcional, presione enter para omitir): ',
            initial: current.altura_cm !== null && current.altura_cm !== undefined ? String(current.altura_cm) : '',
            validate(val) {
                return val.trim() === '' || (!isNaN(val) && Number(val) > 0) ? true : 'Debe ingresar una altura válida o dejarlo vacío.';
            }
        });

        const { fotos } = await Enquirer.prompt({
            type: 'input',
            name: 'fotos',
            message: 'URL / Ruta de fotos (opcional, presione enter para omitir): ',
            initial: current.fotos || ''
        });

        const { comentarios } = await Enquirer.prompt({
            type: 'input',
            name: 'comentarios',
            message: 'Comentarios / observaciones (opcional, presione enter para omitir): ',
            initial: current.comentarios || ''
        });

        await SeguimientoFisicoService.update(id, {
            peso_kg: parseFloat(peso_kg),
            grasa_corporal: grasa_corporal.trim() !== '' ? parseFloat(grasa_corporal) : null,
            altura_cm: altura_cm.trim() !== '' ? parseFloat(altura_cm) : null,
            fotos: fotos.trim() !== '' ? fotos.trim() : null,
            comentarios: comentarios.trim() !== '' ? comentarios.trim() : null
        });

        console.log(chalk.green.bold(`Seguimiento físico con ID ${id} actualizado exitosamente.`));
    }
    catch(err){
        problem(err);
    }
}

export async function deletePhysicalTracking(){
    try{
        const { id } = await Enquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Ingresa el ID del registro de seguimiento físico a eliminar: ',
            validate(val) {
                return !isNaN(val) && val.trim() !== '' ? true : 'Debe ingresar un ID numérico válido.';
            }
        });

        const existsRecord = await SeguimientoFisicoService.getById(id);
        if (!existsRecord || existsRecord.length === 0) {
            console.log(chalk.yellow(`No se encontró ningún registro de seguimiento físico con el ID: ${id}`));
            return;
        }

        const current = existsRecord[0];
        const formatted = formatPhysicalTracking(current);

        console.log(chalk.cyan(`\nDatos del seguimiento físico a eliminar (ID: ${current.id_seguimiento}):`));
        console.table(
            Object.entries(formatted).map(([campo, valor]) => ({
                campo,
                valor: valor ?? 'N/A'
            }))
        );

        const answer = await new Enquirer.Confirm({
            name: 'confirmacion',
            message: '¿Confirmar eliminación?',
            initial: false
        }).run();

        if (answer) {
            console.log(chalk.red(`Eliminando registro con ID ${id} ...`));
            await SeguimientoFisicoService.delete(id);
            console.log(chalk.green.bold(`Registro de seguimiento físico con ID ${id} eliminado exitosamente.`));
        } else {
            console.log(chalk.blue('Eliminación cancelada'));
        }
    }
    catch(err){
        problem(err);
    }
}