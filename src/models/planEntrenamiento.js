export class PlanEntrenamiento{
    constructor(id_nivel, nombre_plan, metas_fisicas, duracion_dias, precio, activo){
        this.id_nivel = id_nivel;
        this.nombre_plan = nombre_plan;
        this.metas_fisicas = metas_fisicas;
        this.duracion_dias = duracion_dias;
        this.precio = precio;
        this.activo = activo;
    }
}