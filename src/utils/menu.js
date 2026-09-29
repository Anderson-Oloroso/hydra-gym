import chalk from "chalk";
import Enquirer from "enquirer";

const entities = [
  'CLIENTES',
  'PLANES DE ENTRENAMIENTO',
  'CLIENTE - PLAN DE ENTRENAMIENTO',
  'GESTION FINANCIERA',
  'CATEGORIAS FINANCIERAS',
  'PLANES DE NUTRICION',
  'DETALLE DE COMIDA DIARIA',
  'SEGUIMIENTO FISICO',
  'CONTRATOS'
];


export function clearScreen() {
    process.stdout.write('\x1Bc');
}

export async function mainMenu() {
    clearScreen();
    console.log(chalk.blue('==================================================='));
    console.log(chalk.redBright('           BIENVENIDO A HYDRA GYM    '));
    console.log(chalk.blue('==================================================='));

    const prompt = new Enquirer.Select({
    name: 'entity',
    message: 'Elija una opción para gestionar:',
    limit: 12,
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
}

export function header(entity){
    console.log(chalk.yellow('=========================================================='));
    console.log(chalk.redBright(`    >>> Gestion de ${entity}    `));
    console.log(chalk.yellow('=========================================================='));
}

const crud = [
    'Listar registros',
    'Crear registros',
    'Actualizar registros',
    'Eliminar registros'
]

export async function submenu(entity) {
    clearScreen();
    header(entity);

    let options = [...crud];

    if (entity.toLowerCase() === 'clientes') {
        options = [
            'Buscar registro por id',
            'Buscar registro por nombre',
            ...options
        ];
    } else if (entity.toLowerCase() === 'gestion financiera') {
        options = [
            ...options,
            'Ver balance financiero (general y por categorías)'
        ];
    } else if (entity.toLowerCase() === 'contratos') {
        options = [
            'Listar registros',
            'Actualizar registros'
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

export async function pause() {
    const prompt = new Enquirer.Invisible({
        name: 'pause',
        message: chalk.gray('\nPresione ENTER para continuar...')
    });
    await prompt.run().catch(() => {});
}
