export class Cliente{
    constructor(dpi, nombre, apellido, correo, activo){
        this.dpi = dpi;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.activo = activo;
    }
    
    esDPIValido(){
        return typeof  this.dpi === 'string' && this.dpi.length === 13;
    }
}
