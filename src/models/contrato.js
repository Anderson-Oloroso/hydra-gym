export class Contrato {
    constructor(id_cliente_plan, condiciones, duracion_dias, precio, fecha_inicio, fecha_fin) {
        this.id_cliente_plan = id_cliente_plan;
        this.condiciones = condiciones;
        this.duracion_dias = duracion_dias;
        this.precio = precio;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }
}
