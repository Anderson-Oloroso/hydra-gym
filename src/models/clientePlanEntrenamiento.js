export class ClientePlanEntrenamiento{
    constructor(id_cliente, id_plan, fecha_inicio, fecha_fin, estado){
        this.id_cliente = id_cliente;
        this.id_plan = id_plan;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.estado = estado;
    }
}