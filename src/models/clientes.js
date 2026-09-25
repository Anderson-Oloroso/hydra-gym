export class Cliente{
    constructor(dpi, nombre, apellido, correo, activo){
        this.dpi = dpi;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.activo = activo;
    }

    getActivo(){
        return Boolean(this.activo)
    }

    getClientes(){
        return `DPI: ${this.dpi}\nNombre: ${this.nombre}\nApellido: ${this.apellido}\nActivo: ${this.getActivo()}`;
    }

    esDPIValido(){
        return typeof  this.dpi === 'string' && this.dpi.length === 13;
    }
}
