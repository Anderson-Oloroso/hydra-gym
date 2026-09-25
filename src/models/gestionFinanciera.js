export class GestionFinanciera{
    constructor(id_categoria, id_cliente, monto, fecha_transaccion, descripcion){
        this.id_categoria = id_categoria;
        this.id_cliente = id_cliente;
        this.monto = monto;
        this.fecha_transaccion = fecha_transaccion;
        this.descripcion = descripcion;
    }
}