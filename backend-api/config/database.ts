import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        // host: env.get('DB_HOST'),
        // port: env.get('DB_PORT'),
        user: 'root',
        password: '',
        database: 'language_test',
        socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig