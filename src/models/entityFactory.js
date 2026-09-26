import { Cliente } from './clientes.js';
import { CategoriaFinanciera } from './categoriaFinanciera.js';
import { PlanEntrenamiento } from './planEntrenamiento.js';
import { ClientePlanEntrenamiento } from './clientePlanEntrenamiento.js';
import { PlanNutricion } from './planNutricion.js';
import { DetalleComida } from './detalleComida.js';
import { SeguimientoFisico } from './seguimientoFisico.js';
import { GestionFinanciera } from './gestionFinanciera.js';

export class EntityFactory{
    
    static create(entityType, data = {}){
        const type = entityType.toLowerCase().trim();

        switch (type){
            case 'clientes':
                return new Cliente(
                    data.dpi,
                    data.nombre,
                    data.apellido,
                    data.correo,
                    data.activo ?? 1
                );
            case 'categoria_financiera':
                return new CategoriaFinanciera(
                    data.nombre,
                    data.tipo, 
                    data.descripcion
                );
            case 'plan_entrenamiento':
                return new PlanEntrenamiento(
                    data.id_nivel,
                    data.nombre_plan,
                    data.metas_fisicas, 
                    data.duracion_dias,
                    data.precio,
                    data.activo ?? 1
                );
            case 'cliente_plan_entrenamiento':
                return new ClientePlanEntrenamiento(
                    data.id_cliente,
                    data.id_plan,
                    data.fecha_inicio,
                    data.fecha_fin,
                    data.estado || 'activo'
                );
            case 'gestion_financiera':
                return new GestionFinanciera(
                    data.id_categoria,
                    data.id_cliente,
                    data.monto,
                    data.descripcion
                );
            case 'plan_nutricion':
                return new PlanNutricion(
                    data.id_cliente_plan,
                    data.nombre,
                    data.descripcion
                );
            case 'detalle_comida':
                return new DetalleComida(
                    data.id_plan_nutricion,
                    data.id_momento,
                    data.dia_semana,
                    data.alimento,
                    data.calorias_estimadas
                );
            case 'seguimiento_fisico':
                return new SeguimientoFisico(
                    data.id_cliente_plan,
                    data.semana,
                    data.peso_kg,
                    data.grasa_corporal,
                    data.altura_cm,
                    data.fotos,
                    data.comentarios
                );
            default:
                throw new Error(`[ EntityError ] -> Tipo de identidad no reconocida: ${entityType}`);
        }
    }
}