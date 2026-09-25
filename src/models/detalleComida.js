export class DetalleComida{
    constructor(id_plan_nutricion, id_momento, dia_semana, alimento, calorias_estimadas){
        this.id_plan_nutricion = id_plan_nutricion;
        this.id_momento = id_momento;
        this.dia_semana = dia_semana;
        this.alimento = alimento;
        this.calorias_estimadas = calorias_estimadas;
    }
}