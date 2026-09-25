import chalk from "chalk";

const entities = [
  'CLIENTES',
  'PLANES DE ENTRENAMIENTO',
  'GESTIÓN FINANCIERA',
  'CATEGORIAS FINANCIERAS',
  'PLANES DE NUTRICIÓN',
  'DETALLE DE COMIDA DIARIA',
  'SEGUIMIENTO FÍSICO',
  'CLIENTE - PLAN DE ENTRENAMIENTO'
];


export async function mainMenu() {
    console.log(chalk.blue('==================================================='));
    console.log(chalk.redBright('           BIENVENIDO A HYDRA GYM    '));
    console.log(chalk.blue('==================================================='));

    entities.forEach((ent, i) =>{
        console.log(chalk.green(`${i+1}. Gestión de ${ent}`));
    });
    console.log(chalk.green(`0. SALIR`));
}

export function header(entity){
    console.log(chalk.yellow('==================================================='));
    console.log(chalk.redBright(`        Gestion de ${entity}    `));
    console.log(chalk.yellow('==================================================='));
}

const crud = [
    'Listar registros',
    'Crear registros',
    'Actualizar registros',
    'Eliminar registros'
]

export async function submenu(entity) {
    header(entity);

    let options = [...crud];

    if (entity.toLowerCase() === 'clientes') {
        options = [
            'Buscar registro por id',
            'Buscar registro por nombre',
            ...options
        ];
    }

    options.forEach((item, i) => {
        console.log(chalk.green(`${i + 1}. ${item}`));
    });
    console.log(chalk.green(`0. Regresar`));
}