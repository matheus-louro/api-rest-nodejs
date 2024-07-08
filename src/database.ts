import { knex as setupKnex} from 'knex';
import { env } from './env';

export const knex = setupKnex({
    client: 'sqlite3',
    connection: {
        filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: './db/migrations',
    }
})

export default knex;