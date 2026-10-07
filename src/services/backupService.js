import fs from 'fs/promises';
import path from 'path';
import { connection } from '../config/database.js';
import { version } from 'os';
import { table, timeStamp } from 'console';
import { json } from 'stream/consumers';

export class Backup{
    static async getTables(){
        const db = await connection();
        const query = 'SHOW TABLES';
        const [ rows ] = await db.query(query);

        if(rows.length === 0) return [];
        const dbNameKey = Object.keys(rows[0])[0];
        return rows.map((row) => row[dbNameKey]);
    }

    static async createBackup(selectedTables){
        let db = await connection();
        let i = 0;
        const data = {
            version: `${i}.0`,
            timestamp: new Date().toISOString(),
            database: process.env.DB_NAME || 'hydra_gym',
            tables: {}
        }

        for(const table of selectedTables){
            const query = `SELECT * FROM \`${table}\``;
            const database = `SHOW CREATE TABLE \`${table}\``;
            const [ rows ] = await db.query(query);
            const [ schema ] = await db.query(database);

            data.tables[table] = {
                createStatement: schema[0]['Create Table'],
                data: rows
            }
        }

        const backupDir = path.resolve(process.cwd(), 'backups');
        await fs.mkdir(backupDir, {recursive: true});

        const timestamName = new Date().toISOString.replace(/:/g, '-').split('.')[0];
        const fileName = `backup_${timestamName}.json`;
        const filePath = path.join(backupDir, fileName);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return { filePath, fileName, totaltablas: selectedTables.length };
    }

    static async listBackups(){
        const backupDir = path.resolve(process.cwd(), 'backups');
        try{
            const files = await fs.readdir(backupDir);
            return files.filter((file) => file.endsWith('.json'));
        }catch(err){
            return []
        }
    }

    static async restoreBackup(){
        const filePath = path.resolve(process.cwd, 'backups', fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const backupData = JSON.parse(fileContent);

        if(!backupData.timestamp || !backupData.tables){    
            throw new Error('El archivo de respaldo está corrupto o no tiene un formato válido.');
        }

        const db = await connection();

        try {
            await db.execute('SET FOREIGN_KEY_CHECKS = 0');
            await db.beginTransaction();

            for (const [tableName, content] of Object.entries(backupData.tables)){
                const targetTable = prefijo ? `${prefijo}_${tableName}` : tableName;

                if(!prefijo){
                    const query = `DROP TABLE IF EXISTS \`${targetTable}\`;`;
                    await db.execute(query);
                }

                let createSql = content.createStatement;
                if (prefijo){
                    createSql = createSql.replace(
                        `CREATE TABLE \`${tableName}\``,
                        `CREATE TABLE \`${targetTable}\``
                    );
                }

                await db.execute(createSql);

                if(content.data && content.data.length > 0){
                    const columns = Object.keys(content.data[0])
                        .map((col) => `\`${col}\``)
                        .join(', ');

                    for(const row of content.data){
                        const values = Object.values(row);
                        const placeholders = values.map(() => '?').join(', ');
                        const query = `INSERT INTO \`${targetTable}\` (${columns}) VALUES(${placeholders})`;
                        await db.execute(query, values);
                    }
                }
            }

            await db.commit();
            await db.execute('SET FOREIGN_KEY_CHECKS = 1');
            return { ok: true, timestamp: backupData.timestamp };
        }
        catch(err){ 
            await db.rollback();
            await db.execute('SET FOREIGN_KEY_CHECKS = 1');
            throw err;
        }
    }
}