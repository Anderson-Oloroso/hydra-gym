import chalk from "chalk";
import Enquirer from "enquirer";

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

    const prompt = new Enquirer.Select({
    name: 'entity',
    message: 'Elija una opción para gestionar:',
    choices: [
      ...entities.map((ent, i) => ({
        name: ent,
        message: `${i + 1}. Gestión de ${ent}`,
        value: ent
      })),
      { name: 'SALIR', message: '0. SALIR', value: 'SALIR' }
        ]
    });

    return await prompt.run();
    // entities.forEach((ent, i) =>{
    //     console.log(chalk.green(`${i+1}. Gestión de ${ent}`));
    // });
    // console.log(chalk.green(`0. SALIR`));
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

    const propmt = new Enquirer.Select({
        name: 'action',
        message: `Acción para ${entity}`,
        choices:[
            ...options.map((item, i) =>({
                name: item,
                message: `${i+1}. ${item}`,
                value: item
            })),
            {name: 'Regresar', message: '0. Regresar', value: 'REGRESAR'}
        ]
    });

    return await propmt.run();
}