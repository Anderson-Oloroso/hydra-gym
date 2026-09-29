# Documentación del Diseño de Base de Datos - Hydra Gym1. 

## Objetivo del Proyecto
> El objetivo principal del diseño e implementación de esta base de datos es proveer una estructura relacional limpia, escalable y normalizada (hasta la Tercera Forma Normal o 3FN) para el sistema de gestión del gimnasio Hydra Gym. La base de datos centraliza la administración de clientes, el seguimiento de sus planes de entrenamiento y contratos vigentes, el monitoreo del progreso físico, la planificación nutricional personalizada y la gestión de ingresos y egresos contables del establecimiento.

## Supuestos del Negocio
Para la modelación de esta base de datos se asumieron los siguientes criterios operativos y reglas de negocio:
- Documento de Identificación: Cada cliente registrado posee un documento de identificación personal (DPI en Guatemala) único de 13 caracteres de tipo texto (VARCHAR(13)), previniendo desbordamientos de datos numéricos.
- Independencia del Contrato y la Rutina:
La tabla contrato gestiona el marco legal y financiero (período pagado, precio pactado y cláusulas).   
La tabla asignacion_plan gestiona el ciclo operativo de entrenamiento.   
Esto permite que un cliente firme un contrato en una fecha determinada pero inicie la ejecución física de su rutina en una fecha posterior sin alterar el histórico contable.   
- Generación de Contratos: Un contrato se asocia únicamente a una asignación de plan activa (relación $1:1$).   
- Independencia de Pagos Financieros: La tabla gestion_financiera permite registrar ingresos asociados a un cliente específico, así como gastos generales del establecimiento (como pago de servicios o mantenimiento de máquinas) mediante la clave foránea opcional (NULLABLE).   
- Planes Nutricionales Adaptables: Un plan nutricional está compuesto por un desglose diario organizado por días de la semana y momentos de comida prediseñados (desayuno, almuerzo, cena, etc.).   

## Matriz de Cardinalidades y RelacionesTabla
| Origen | Tabla Destino | Cardinalidad | Explicación |
| :--- | :--- | :--- | :--- |
| nivel_entrenamiento | plan_entrenamiento | 1 : N | Un nivel clasifica a muchos planes de entrenamiento. |
| clientes | asignacion_plan | 1 : N | Un cliente puede tener múltiples asignaciones a lo largo del tiempo. |
| plan_entrenamiento | asignacion_plan | 1 : N | Un plan de entrenamiento puede ser asignado a muchos clientes. |
| asignacion_plan | contrato | 1 : 1 | Cada asignación genera únicamente un contrato vinculante. |
| asignacion_plan | seguimiento_fisico | 1 : N | Una asignación cuenta con múltiples controles físicos semanales. |
| asignacion_plan | plan_nutricion | 1 : N | Una asignación puede tener asignados uno o varios planes nutricionales. |
| plan_nutricion | detalle_comida_diaria | 1 : N | Un plan nutricional contiene múltiples desglose de alimentos diarios. |
| momento_comida | detalle_comida_diaria | 1 : N | Un tiempo de comida (ej: Almuerzo) se repite en múltiples detalles. |
| categoria_financiera | gestion_financiera | 1 : N | Una categoría engloba múltiples movimientos financieros. |
| clientes | gestion_financiera | 0/1 : N | Un cliente genera pagos registrados; los egresos no tienen cliente ligado. |
  