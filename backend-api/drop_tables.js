
import mysql from 'mysql2/promise';

async function dropTables() {
    const connection = await mysql.createConnection({
        user: 'root',
        password: '',
        database: 'language_test',
        socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
    });

    try {
        const [rows] = await connection.query('SHOW TABLES');
        if (rows.length === 0) {
            console.log('No tables found.');
            process.exit(0);
        }

        // Disable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        for (const row of rows) {
            const tableName = Object.values(row)[0];
            console.log(`Dropping table: ${tableName}`);
            await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        }

        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('All tables dropped successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping tables:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

dropTables();
